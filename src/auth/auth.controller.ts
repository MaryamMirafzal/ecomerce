import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/users/entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const register = await this.authService.register(
      registerDto.mobile,
      registerDto.password,
      registerDto.display_name,
    );

    return {
      statusCode: HttpStatus.OK,
      data: register,
      message: 'ثبت نام با موفقیت انجام شد!',
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const login = await this.authService.login(
      loginDto.mobile,
      loginDto.password,
    );

    return {
      statusCode: HttpStatus.OK,
      data: login,
      message: 'با موفقیت وارد شدید!',
    };
  }
}
