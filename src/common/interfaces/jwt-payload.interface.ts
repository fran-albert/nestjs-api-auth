import { Role } from "../enums/role.enum";

export interface JWTPayload {
    username: string;
    sub: number;
    role: Role[];
}


