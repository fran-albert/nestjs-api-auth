import { UserDomain } from '../../domain/user.domain';
import { UserEntity } from '../../infrastructure/entities/user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  create(userInformation: UserDomain): Promise<UserEntity>;
  findAll(): Promise<UserEntity[]>;
  findOneById(userId: number): Promise<UserEntity | undefined>;
  findOneByUsername(username: string): Promise<UserEntity | undefined>;
  findOneByEmail(email: string): Promise<UserDomain | undefined>;
  update(id: number, updatedUserInformation: UserDomain): Promise<UserEntity>;
  save(user: UserDomain): Promise<UserEntity>;
}
