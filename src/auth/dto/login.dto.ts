import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty()
    password: string;
}
