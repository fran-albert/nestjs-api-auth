import { Base } from '@/common/domain/base.domain';
import { Role } from '@/modules/roles/infrastructure/role.entity';

export class UserDomain extends Base {
  username: string;
  email: string;
  password: string;
  role?: Role;
}
