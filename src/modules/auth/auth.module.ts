import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { MailService } from 'src/services/mail.service';
import { RolesModule } from '@/modules/roles/roles.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from './infrastructure/entities/auth.entity';
import { UserEntity } from '../user/infrastructure/entities/user.entity';
import { ResetToken } from './infrastructure/entities/reset-token.entity';
import { AuthEntityRepository } from './infrastructure/auth-entity.repository';
import { RefreshToken } from './infrastructure/entities/refresh-token.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';


@Module({
  imports: [
    RolesModule,
    UserModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('AUTH_SECRET_KEY'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    PassportModule,
    TypeOrmModule.forFeature([RefreshToken, ResetToken], process.env.DB_NAME),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService, AuthEntityRepository],
  exports: [AuthService, AuthEntityRepository],
})
export class AuthModule { }
