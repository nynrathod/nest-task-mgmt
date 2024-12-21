import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Public } from './dto/public.decorator';
import { UserResponseDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(@Body() signupDto: SignupAuthDto) {
    return this.authService.signup(signupDto);
  }

  @Public()
  @Post('login')
  async signin(@Body() loginDto: LoginAuthDto) {
    return this.authService.signin(loginDto);
  }

  @Get('users')
  async getAllUsers(): Promise<UserResponseDto[]> {
    return this.authService.findAll();
  }
}
