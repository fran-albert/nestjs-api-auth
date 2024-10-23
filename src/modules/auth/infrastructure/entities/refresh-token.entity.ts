import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '@/modules/user/infrastructure/entities/user.entity';

@Entity('refresh_tokens') 
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @Column()
  expiryDate: Date;

  @ManyToOne(() => UserEntity, user => user.refreshTokens, { onDelete: 'CASCADE' }) 
  user: UserEntity
}
