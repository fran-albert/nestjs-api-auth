import { Permission } from '@/modules/permissions/infrastructure/permissions.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => Permission, (permission) => permission.role, { cascade: true })
  permissions: Permission[];
}

