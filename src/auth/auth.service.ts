import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import UserRoleEnum from 'src/users/enums/userRoleEnum';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    mobile: string,
    password: string,
    display_name: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      mobile,
      password: hashedPassword,
      display_name,
      role: UserRoleEnum.NormalUser,
    });
    return user;
  }

  async login(mobile: string, password: string) {
    const user = await this.usersService.findOneByMobile(mobile);

    if (!(await bcrypt.compare(password, user!.password))) {
      throw new UnauthorizedException('رمز عبور شما اشتباه است');
    }

    const payload = {
      mobile: user!.mobile,
      sub: user!.id,
      display_name: user!.display_name,
    };
    const token: string = this.jwtService.sign(payload);

    return {
      accessToken: token,
    };
  }
}
