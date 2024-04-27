import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserAuthDto, UserDto } from './user.dto';
import { AuthGuardAdmin } from './user.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuardAdmin)
  @Get()
  async show(): Promise<UserDto[]> {
    const response = await this.userService.show();
    return response;
  }

  @Post('/signup')
  async subscribe(@Body() newUser: UserAuthDto) {
    const response = await this.userService.subscribe(newUser);
    return response;
  }

  @Post('/signin')
  async login(@Body() user: UserAuthDto) {
    const response = await this.userService.login(user);
    return response;
  }
}
