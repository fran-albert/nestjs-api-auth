import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dtos/role.dto';
import { Role } from './infrastructure/role.entity';
import { Permission } from '../permissions/infrastructure/permissions.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
  ) { }

  async createRole(roleDto: CreateRoleDto) {
    const role = this.roleRepository.create({ name: roleDto.name });
    const savedRole = await this.roleRepository.save(role);

    const permissions = roleDto.permissions.map(permissionDto => {
      const permission = this.permissionRepository.create({
        ...permissionDto,
        role: savedRole,  
      });
      return permission;
    });

    await this.permissionRepository.save(permissions);

    return { ...savedRole, permissions };
  }


  async getRoleById(roleId: number) {
    return this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
  }
}
