import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './infrastructure/role.entity';
import { Permission } from '../permissions/infrastructure/permissions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
