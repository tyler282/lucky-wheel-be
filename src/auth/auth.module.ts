import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config as envConfig } from 'dotenv';
envConfig();
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '6000s' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
