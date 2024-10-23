import { Type } from 'class-transformer';
import {
  IsString,
  ValidateNested,
} from 'class-validator';
import { Permission } from '@/modules/permissions/dto/permissions.dto';

export class CreateRoleDto {
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => Permission)
  permissions: Permission[];
}
