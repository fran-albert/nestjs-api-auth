import { IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(2)
  phone: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(4)
  password: string;
}
