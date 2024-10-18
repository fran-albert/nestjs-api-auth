import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcryptjs from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { Role } from '../common/enums/role.enum';
import { JWTPayload } from 'src/common/interfaces/jwt-payload.interface';



@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmailWithPassword(
            loginDto.username,
        );
        if (!user) {
            throw new UnauthorizedException('Username is wrong');
        }

        const isPasswordValid = await bcryptjs.compare(
            loginDto.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Password is wrong');
        }

        const payload = { username: user.username, sub: user.id, role: user.role };
        const { accessToken, refreshToken } = await this.generateTokens(payload);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    private async generateTokens(payload: JWTPayload) {
        const accessToken = await this.generateToken(payload, '15m');
        const refreshToken = await this.generateToken(payload, '7d');
        return { accessToken, refreshToken };
    }

    private async generateToken(payload: JWTPayload, expiresIn: string) {
        return this.jwtService.signAsync(payload, { expiresIn });
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken);

            const user = await this.usersService.findOne(payload.sub);

            const newAccessToken = await this.generateToken(
                { username: user.username, sub: user.id, role: user.role },
                '15m',
            );

            return {
                access_token: newAccessToken,
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async register(registerDto: RegisterDto) {
        const usernameExists = await this.usersService.findOneByUsername(registerDto.username);
        if (usernameExists) {
            throw new UnauthorizedException('Username already exists');
        }

        const emailExists = await this.usersService.findOneByEmail(registerDto.email);
        if (emailExists) {
            throw new UnauthorizedException('Email already exists');
        }

        const newUser = {
            ...registerDto,
            password: await bcryptjs.hash(registerDto.password, 10),
            role: [Role.USER],
        }

        return await this.usersService.create(newUser);
    }
}
