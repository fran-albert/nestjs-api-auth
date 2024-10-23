import { UserDomain } from '../../domain/user.domain';
import { UpdateUserDto } from '../dto/request/update-user.dto';

export function fromUpdateUserToUserDomain(
  updateUser: UpdateUserDto,
): UserDomain {
  return {
    username: updateUser.username,
    email: updateUser.email,
    password: updateUser.password,
  };
}
