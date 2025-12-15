import { Body, Controller, Post, Put } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto);
  }

  @Put('login')
  async login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }
}
