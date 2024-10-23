import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './application/service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '@/common/common.module';
import { UserEntity } from './infrastructure/entities/user.entity';
import { USER_REPOSITORY } from './application/interface/user.repository.interface';
import { UserPostgreSQLRepository } from './infrastructure/user.postgresql.repository';
import { Role } from '../roles/infrastructure/role.entity';
import { ResetToken } from '../auth/infrastructure/entities/reset-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    CommonModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserPostgreSQLRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule { }
