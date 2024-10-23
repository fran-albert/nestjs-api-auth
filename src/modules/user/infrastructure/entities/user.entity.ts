import { AuthEntity } from '@/modules/auth/infrastructure/entities/auth.entity';
import { Base } from '@/common/infrastructure/entities/base.entity';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { Role } from '@/modules/roles/infrastructure/role.entity';
import { ResetToken } from '@/modules/auth/infrastructure/entities/reset-token.entity';

@Entity({ name: 'user' })
export class UserEntity extends Base {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, { nullable: true, eager: true })
  role: Role;

  @OneToMany(() => AuthEntity, (refreshToken) => refreshToken.user)
  refreshTokens: AuthEntity[];

  @OneToMany(() => ResetToken, (resetToken) => resetToken.user)
  resetTokens: ResetToken[];
}
