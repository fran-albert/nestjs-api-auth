import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Resource } from "../../roles/enums/resource.enum";
import { Action } from "../../roles/enums/action.enum";
import { Role } from "../../roles/infrastructure/role.entity";

@Entity({ name: 'permissions' })
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Resource,
    nullable: false,
  })
  resource: Resource;

  @Column({
    type: 'enum',
    enum: Action,
    array: true, 
  })
  actions: Action[];

  @ManyToOne(() => Role, (role) => role.permissions, { onDelete: 'CASCADE' })
  role: Role;
}
