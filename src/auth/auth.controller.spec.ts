import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with the correct loginDto and return a token', async () => {
      const loginDto: LoginDto = { username: 'testuser', password: 'password123' };
      const token = { access_token: 'mockToken' };

      mockAuthService.login.mockResolvedValue(token);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(token);
    });
  });

  describe('register', () => {
    it('should call authService.register with the correct registerDto and return the registered user', async () => {
      const registerDto: RegisterDto = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        name: 'John',
        lastName: 'Doe',
        phone: '1234567890',
      };
      const newUser = { id: 1, username: 'newuser', email: 'newuser@example.com' };

      mockAuthService.register.mockResolvedValue(newUser);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(newUser);
    });
  });
});
