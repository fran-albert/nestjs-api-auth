import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './infrastructure/entities/refresh-token.entity';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import { ResetToken } from './infrastructure/entities/reset-token.entity';
import { MailService } from 'src/services/mail.service';
import { RolesService } from '@/modules/roles/roles.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { UserEntity } from '../user/infrastructure/entities/user.entity';
import { UserService } from '../user/application/service/user.service';
import { UserDomain } from '../user/domain/user.domain';

@Injectable()
export class AuthService {
  constructor(
    // @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(ResetToken)
    private readonly resetTokenRepository: Repository<ResetToken>,
    private jwtService: JwtService,
    private mailService: MailService,
    private rolesService: RolesService,
    private userService: UserService,
  ) { }

  async signup(signupData: SignupDto): Promise<UserDomain> {
    return await this.userService.create(signupData);
  }

  async login(credentials: LoginDto) {
    const { email, password } = credentials;
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const tokens = await this.generateUserTokens(user.id);
    return {
      ...tokens,
      userId: user.id,
    };
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.userService.findOneById(userId);

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newHashedPassword;
    await this.userService.save(user);
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findOneByEmail(email);

    if (user) {
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const resetToken = nanoid(64);
      const token = await this.resetTokenRepository.save({
        token: resetToken,
        user: user,
        expiryDate,
      });
      console.log(token);
      this.mailService.sendPasswordResetEmail(email, resetToken);
    }

    return { message: 'If this user exists, they will receive an email' };
  }

  async resetPassword(newPassword: string, resetToken: string) {
    const token = await this.resetTokenRepository.findOneBy({
      token: resetToken,
      expiryDate: MoreThan(new Date()),
    });

    if (!token) {
      throw new UnauthorizedException('Invalid link');
    }

    const user = await this.userService.findOneById(token.user.id);
  
    user.password = await bcrypt.hash(newPassword, 10);
    await this.userService.save(user);
  }

  async refreshTokens(refreshToken: string) {
    const token = await this.refreshTokenRepository.findOneBy({
      token: refreshToken,
      expiryDate: MoreThan(new Date()),
    });

    if (!token) {
      throw new UnauthorizedException('Refresh Token is invalid');
    }
    return this.generateUserTokens(token.user.id);
  }

  async generateUserTokens(userId: number) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '10h' });
    const refreshToken = uuidv4();

    await this.storeRefreshToken(refreshToken, userId);
    return {
      accessToken,
      refreshToken,
    };
  }

  async storeRefreshToken(token: string, userId: number) {
    const expiryDate = this.calculateExpiryDate();
    const existingToken = await this.findExistingRefreshToken(userId);

    if (existingToken) {
      await this.updateExistingToken(existingToken, token, expiryDate);
    } else {
      await this.createNewRefreshToken(token, userId, expiryDate);
    }
  }

  private calculateExpiryDate(): Date {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);
    return expiryDate;
  }

  private async findExistingRefreshToken(userId: number): Promise<RefreshToken | null> {
    return await this.refreshTokenRepository.findOneBy({ user: { id: userId } });
  }

  private async updateExistingToken(existingToken: RefreshToken, newToken: string, expiryDate: Date): Promise<void> {
    existingToken.token = newToken;
    existingToken.expiryDate = expiryDate;
    await this.refreshTokenRepository.save(existingToken);
  }

  private async createNewRefreshToken(token: string, userId: number, expiryDate: Date): Promise<void> {
    const newRefreshToken = this.refreshTokenRepository.create({
      token,
      user: { id: userId },
      expiryDate,
    });
    await this.refreshTokenRepository.save(newRefreshToken);
  }

  async getUserPermissions(userId: number) {
    const user = await this.userService.findOneById(userId);

    if (!user) throw new BadRequestException();
    const role = await this.rolesService.getRoleById(Number(user.role.id));
    return role.permissions;
  }
}
