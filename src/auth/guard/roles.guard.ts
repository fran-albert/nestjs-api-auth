import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorators';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const { user } = request;
    
    if (user.role?.includes(Role.ADMIN)) {
      return true;
    }

    const userId = user.sub;
    const routeUserId = request.params.id; 

    if (routeUserId && userId !== parseInt(routeUserId)) {
      throw new ForbiddenException('No tienes acceso a este recurso.');
    }

    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
