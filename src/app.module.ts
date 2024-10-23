import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { environmentConfiguration } from './config/environment.configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesModule } from './modules/roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasourceOptions } from './config/orm.configuration';
import { DataSource } from 'typeorm';
import { configurationValidate } from './config/configuration.validate';
import { UserModule } from './modules/user/user.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [environmentConfiguration],
      validationSchema: configurationValidate,
      isGlobal: true,
    }),
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (config) => ({
    //     secret: config.get('jwt.secret'),
    //   }),
    //   global: true,
    //   inject: [ConfigService],
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT'), 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    // TypeOrmModule.forRootAsync({
    //   name: process.env.DB_NAME,
    //   useFactory: () => ({
    //     ...datasourceOptions, // Aquí usas tu configuración de orm.configuration
    //     autoLoadEntities: true, // Auto carga las entidades
    //     allowJs: true, // Permite cargar archivos .js si es necesario
    //   }),
    //   dataSourceFactory: async (options) => {
    //     return new DataSource(options).initialize(); // Inicializa la fuente de datos
    //   },
    // }),
    AuthModule,
    RolesModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
