import { Role } from "src/common/enums/role.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    username: string;

    @Column({ select: false })
    password: string;

    @Column()
    phone: string;

    @Column({ unique: true })
    email: string;

    @Column("simple-array")
    role: Role[];
}
