import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../interface/user.repository.interface';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { MapperService } from '@/common/application/mapper/mapper.service';
import { UserDomain } from '../../domain/user.domain';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from '../dto/request/update-user.dto';
import { fromUpdateUserToUserDomain } from '../mapper/user.mapper';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly mapperService: MapperService,
  ) { }

  async create(userInformation: CreateUserDto): Promise<UserDomain> {
    await this.userExist(userInformation.username);
    await this.userExist(userInformation.email);

    const passwordEncrypted = await bcrypt.hash(userInformation.password, 10);

    userInformation.password = passwordEncrypted;
    const userDomain = this.mapperService.dtoToClass(
      userInformation,
      new UserDomain(),
    );
    return await this.userRepository.create(userDomain);
  }

  async findAll(): Promise<UserDomain[]> {
    return await this.userRepository.findAll();
  }

  async findOneByUsername(username: string): Promise<UserDomain | undefined> {
    return await this.userRepository.findOneByUsername(username);
  }

  async findOneById(userId: number): Promise<UserDomain | undefined> {
    const user = await this.userRepository.findOneById(userId);

    if (!user) {
      throw new NotFoundException('User not found...');
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<UserDomain | undefined> {
    return await this.userRepository.findOneByEmail(email);
  }

  async userExist(param: string): Promise<boolean> {
    const userByUsername = await this.findOneByUsername(param);
    const userByEmail = await this.findOneByEmail(param);

    if (userByUsername || userByEmail) {
      throw new BadRequestException('User already exists');
    }

    return false;

  }

  async update(
    userId: number,
    updatedUserInformation: UpdateUserDto,
  ): Promise<any> {
    const userMapped = fromUpdateUserToUserDomain(updatedUserInformation);
    return await this.userRepository.update(userId, userMapped);
  }

  async save(user: UserDomain): Promise<UserDomain> {
    return await this.userRepository.save(user);
  }
}
