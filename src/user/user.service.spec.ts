import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Role } from '../common/enum/role.type';
import { ResponseDto } from '../common/dto/response.dto';
import { ErrorMessage, ResponseMessage } from '../common/response-message';
import { buildErrorResponse } from '../common/utils/utility';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });
  it('should create a user successfully', async () => {
    const createUserDto = {
      name: 'John Doe',
      phoneNumber: '1234567890',
    } as User;

    const savedUser = {
      id: 1,
      name: 'John Doe',
      phoneNumber: '1234567890',
      role: Role.GUEST,
    } as User;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser);

    const result: ResponseDto = await service.create(createUserDto);

    expect(result).toEqual({
      data: result.data,
      isSuccess: true,
      message: ResponseMessage.SUCCESS,
    });
  });

  it('should handle errors during user creation', async () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      phoneNumber: '1234567890',
    };

    const errorMessage = 'Error saving user';
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    jest
      .spyOn(userRepository, 'save')
      .mockRejectedValue(new Error(errorMessage));

    const result: ResponseDto = await service.create(createUserDto);

    expect(result).toEqual(buildErrorResponse(errorMessage));
  });

  it('should handle the scenario where the user already exists', async () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      phoneNumber: '1234567890',
    };

    const existingUser = {
      id: 1,
      name: 'John Doe',
      phoneNumber: '1234567890',
      role: Role.GUEST,
    } as User;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(existingUser);

    const result: ResponseDto = await service.create(createUserDto);

    expect(result).toEqual({
      data: null,
      isSuccess: false,
      message: `User ${ErrorMessage.EXISTED}`,
    });
  });
});
