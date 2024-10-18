import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call usersService.create with the correct DTO and return the created user', async () => {
      const createUserDto: CreateUserDto = { name: 'Test User', email: 'test@example.com', username: 'testuser', password: '123456' };
      const createdUser = { id: 1, ...createUserDto };

      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await controller.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });
  });
  describe('findAll', () => {
    it('should call usersService.findAll and return a list of users', async () => {
      const users = [{ id: 1, name: 'User One' }, { id: 2, name: 'User Two' }];

      mockUsersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(usersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });
  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const user = { id: 1, name: 'Test User' };
  
      mockUsersService.findOne.mockResolvedValue(user);
  
      const result = await controller.findOne(1);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(user);
    });
  
    it('should throw NotFoundException if user is not found', async () => {
      mockUsersService.findOne.mockRejectedValue(new NotFoundException(`User with ID 1 not found`));
  
      await expect(controller.findOne(1)).rejects.toThrow(
        new NotFoundException(`User with ID 1 not found`),
      );
    });
  });
  
  describe('update', () => {
    it('should call usersService.update with the correct id and DTO, and return the updated user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated User' };
      const updatedUser = { id: 1, ...updateUserDto };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update('1', updateUserDto);

      expect(usersService.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should call usersService.remove with the correct id', async () => {
      const id = 1;

      await controller.remove(id);

      expect(usersService.remove).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const id = 1;

      mockUsersService.remove.mockRejectedValue(new NotFoundException(`User with ID ${id} not found`));

      await expect(controller.remove(id)).rejects.toThrow(
        new NotFoundException(`User with ID ${id} not found`),
      );
    });
  });
});
