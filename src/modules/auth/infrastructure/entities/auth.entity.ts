import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '@/common/domain/base.domain';
import { UserEntity } from '@/modules/user/infrastructure/entities/user.entity';

@Entity({ name: 'auth' })
export class AuthEntity extends Base {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  refreshToken: string;

  @ManyToOne(() => UserEntity, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  user: UserEntity; 
}
