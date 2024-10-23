import { SetMetadata } from '@nestjs/common';
import { Permission } from '@/modules/permissions/dto/permissions.dto';

export const PERMISSIONS_KEY = "permissions";

export const Permissions = (permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

