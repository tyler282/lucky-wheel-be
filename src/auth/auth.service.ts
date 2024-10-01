import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { config as envConfig } from 'dotenv';
import { ErrorMessage, ResponseMessage } from '../common/response-message';
import { BaseResponse } from '../common/utils/base-response.dto';

envConfig();
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(phoneNumber: string, password: string): Promise<BaseResponse> {
    const user = await this.userRepository.findOne({
      where: { phoneNumber, password },
      select: ['id', 'phoneNumber', 'name', 'totalPoints'],
    });

    if (!user) {
      throw new UnauthorizedException(ErrorMessage.USERNAME_PASSWORD_INCORRECT);
    }
    const payload = { id: user.id, phoneNumber: user.phoneNumber };
    return {
      data: {
        access_token: await this.jwtService.signAsync(payload, {
          secret: process.env.SECRET_KEY,
        }),
        user,
      },
      isSuccess: true,
      message: ResponseMessage.SUCCESS,
    };
  }
}
