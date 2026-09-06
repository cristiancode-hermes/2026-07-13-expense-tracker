import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email, orgId: user.organizationId };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organizationId: user.organizationId,
      },
    };
  }

  async register(dto: RegisterDto) {
    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      organizationId: dto.organizationId,
      role: 'member',
    });
    const payload = { sub: user.id, email: user.email, orgId: user.organizationId };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}
