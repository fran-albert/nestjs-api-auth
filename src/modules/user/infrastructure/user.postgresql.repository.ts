import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDomain } from '@/modules/user/domain/user.domain';
import { UserEntity } from './entities/user.entity';
import { IUserRepository } from '../application/interface/user.repository.interface';

@Injectable()
export class UserPostgreSQLRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async create(userInformation: UserDomain): Promise<UserEntity> {
    try {
      const userEntity = this.userRepository.create(userInformation);
      return await this.userRepository.save(userEntity);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async findAll(): Promise<UserEntity[]> {
    try {
      return await this.userRepository.find();
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async findOneByUsername(username: string): Promise<UserEntity | undefined> {
    try {
      return await this.userRepository.findOne({ where: { username } });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async findOneById(userId: number): Promise<UserEntity | undefined> {
    try {
      return await this.userRepository.findOne({ where: { id: userId } });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async findOneByEmail(email: string): Promise<UserDomain | undefined> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async update(
    id: number,
    updatedUserInformation: Partial<UserDomain>,
  ): Promise<UserEntity> {
    try {
      const userUpdate = await this.userRepository.preload({
        id,
        ...updatedUserInformation,
      });

      if (!userUpdate) {
        throw new Error(`user #${id} do not exist`);
      }

      return await this.userRepository.save(userUpdate);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async save(user: UserDomain): Promise<UserEntity> {
    try {
      return await this.userRepository.save(user);
    } catch (e) {
      throw new Error(e.message);
    }
  }

}
