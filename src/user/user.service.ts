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

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
