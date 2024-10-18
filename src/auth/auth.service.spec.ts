import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcryptjs from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmailWithPassword: jest.fn(),
    findOneByUsername: jest.fn(),
    findOneByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw an UnauthorizedException if user is not found', async () => {
      mockUsersService.findByEmailWithPassword.mockResolvedValue(null);
      const loginDto = { username: 'nonexistent', password: 'password' };

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Username is wrong'),
      );
    });

    it('should throw an UnauthorizedException if password is wrong', async () => {
      const user = { username: 'test', password: 'hashedPassword' };
      mockUsersService.findByEmailWithPassword.mockResolvedValue(user);
      jest.spyOn(bcryptjs, 'compare').mockResolvedValue(false);
      const loginDto = { username: 'test', password: 'wrongpassword' };

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Password is wrong'),
      );
    });

    it('should return an access token if credentials are correct', async () => {
      const user = { id: 1, username: 'test', password: 'hashedPassword', role: 'user' };
      mockUsersService.findByEmailWithPassword.mockResolvedValue(user);
      jest.spyOn(bcryptjs, 'compare').mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('signedToken');
      const loginDto = { username: 'test', password: 'password' };

      const result = await service.login(loginDto);

      expect(mockUsersService.findByEmailWithPassword).toHaveBeenCalledWith('test');
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        username: 'test',
        sub: 1,
        role: 'user',
      });
      expect(result).toEqual({ access_token: 'signedToken' });
    });
  });

  describe('register', () => {
    it('should throw an UnauthorizedException if username already exists', async () => {
      mockUsersService.findOneByUsername.mockResolvedValue({ username: 'existingUser' });
      const registerDto = { username: 'existingUser', email: 'newemail@example.com', password: 'password', phone: '1234567890', name: 'John', lastName: 'Doe' };

      await expect(service.register(registerDto)).rejects.toThrow(
        new UnauthorizedException('Username already exists'),
      );
    });

    it('should throw an UnauthorizedException if email already exists', async () => {
      mockUsersService.findOneByUsername.mockResolvedValue(null);
      mockUsersService.findOneByEmail.mockResolvedValue({ email: 'existing@example.com' });
      const registerDto = { username: 'newuser', email: 'existing@example.com', password: 'password', phone: '1234567890', name: 'John', lastName: 'Doe' };

      await expect(service.register(registerDto)).rejects.toThrow(
        new UnauthorizedException('Email already exists'),
      );
    });

    it('should create a new user if username and email do not exist', async () => {
      mockUsersService.findOneByUsername.mockResolvedValue(null);
      mockUsersService.findOneByEmail.mockResolvedValue(null);
      jest.spyOn(bcryptjs, 'hash').mockResolvedValue('hashedPassword');
      const newUser = { id: 1, username: 'newuser', email: 'new@example.com', role: ['user'] };
      mockUsersService.create.mockResolvedValue(newUser);
      const registerDto = { username: 'newuser', email: 'new@example.com', password: 'password', phone: '1234567890', name: 'John', lastName: 'Doe' };

      const result = await service.register(registerDto);

      expect(mockUsersService.findOneByUsername).toHaveBeenCalledWith('newuser');
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith('new@example.com');
      expect(bcryptjs.hash).toHaveBeenCalledWith('password', 10);
      expect(mockUsersService.create).toHaveBeenCalledWith({
        ...registerDto,
        password: 'hashedPassword',
        role: ['user'],
      });
      expect(result).toEqual(newUser);
    });
  });
});
