import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ResponseDto } from '../common/dto/response.dto';
import { buildErrorResponse } from '../common/utils/utility';
import { ErrorMessage, ResponseMessage } from '../common/response-message';
import { Role } from '../common/enum/role.type';
import { BaseResponse } from '../common/utils/base-response.dto';

@Injectable()
export class UserService {
  constructor(
    // Inject the repository for the User entity
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<ResponseDto> {
    try {
      const data = await this.userRepository.findOne({
        where: { phoneNumber: createUserDto.phoneNumber },
      });
      if (data) {
        return buildErrorResponse(`User ${ErrorMessage.EXISTED}`);
      }
      const user = new User();
      user.name = createUserDto.name;
      user.phoneNumber = createUserDto.phoneNumber;
      user.role = Role.GUEST;
      await this.userRepository.save(user);

      return {
        data: user,
        isSuccess: true,
        message: ResponseMessage.SUCCESS,
      };
    } catch (error) {
      return buildErrorResponse(error.message);
    }
  }

  async findOne(phoneNumber: string): Promise<BaseResponse> {
    const user = await this.userRepository.findOne({ where: { phoneNumber } });
    if (!user) {
      return buildErrorResponse(ErrorMessage.USER_NOT_FOUND);
    }
    return {
      data: user,
      isSuccess: true,
      message: ResponseMessage.SUCCESS,
    };
  }
}
