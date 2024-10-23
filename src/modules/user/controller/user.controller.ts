import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../application/service/user.service';
import { CreateUserDto } from '../application/dto/request/create-user.dto';
import { UserDomain } from '../domain/user.domain';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() userInformation: CreateUserDto): Promise<UserDomain> {
    return await this.userService.create(userInformation);
  }
}
