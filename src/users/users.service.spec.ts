import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto'; 
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
        username: 'testuser',
        role: 'user',
      };

      const userEntity = {
        id: 1,
        ...createUserDto,
      };

      mockUserRepository.create.mockReturnValue(userEntity);
      mockUserRepository.save.mockResolvedValue(userEntity);

      const result = await service.create(createUserDto);
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(userEntity);
      expect(result).toEqual(userEntity);
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      const user = { id: 1, email, username: 'testuser' };

      mockUserRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findOneByEmail(email);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email });
      expect(result).toEqual(user);
    });
  });

  describe('findOneByUsername', () => {
    it('should return a user by username', async () => {
      const username = 'testuser';
      const user = { id: 1, username, email: 'test@example.com' };

      mockUserRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findOneByUsername(username);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ username });
      expect(result).toEqual(user);
    });
  });

  describe('findByEmailWithPassword', () => {
    it('should return a user with password by username', async () => {
      const username = 'testuser';
      const user = { 
        id: 1, 
        name: 'Test User', 
        username, 
        password: 'hashed_password', 
        email: 'test@example.com', 
        role: 'user' 
      };

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findByEmailWithPassword(username);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { username },
        select: ['id', 'name', 'username', 'password', 'email', 'role'],
      });
      expect(result).toEqual(user);
    });
  });
  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const id = 1;
      const user = { id, name: 'Test User' };

      mockUserRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findOne(id);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(result).toEqual(user);
    });

    it('should throw a NotFoundException if user is not found', async () => {
      const id = 1;

      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(
        new NotFoundException(`Usuario con ID ${id} no encontrado`),
      );
    });
  });

  /*describe('update', () => {
    it('should return the updated user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated User' };

      const result = service.update(1, updateUserDto);

      expect(result).toEqual(`This action updates a #1 user`);
    });
  }); */

  describe('remove', () => {
    it('should remove a user by ID', async () => {
      const id = 1;

      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(id);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(id);
    });

    it('should throw a NotFoundException if user is not found', async () => {
      const id = 1;

      mockUserRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(id)).rejects.toThrow(
        new NotFoundException(`Usuario con ID ${id} no encontrado`),
      );
    });
  });
});
