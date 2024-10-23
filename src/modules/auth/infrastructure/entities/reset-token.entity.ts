import { UserEntity } from '@/modules/user/infrastructure/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('reset_tokens')
export class ResetToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @Column()
  expiryDate: Date;

  @ManyToOne(() => UserEntity, user => user.resetTokens, { onDelete: 'CASCADE', eager: true })
  user: UserEntity;
}
