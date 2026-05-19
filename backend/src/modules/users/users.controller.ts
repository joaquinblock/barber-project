import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User as SharedUser, UserResponseDTO } from '@business/shared/types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async registerUser(@Body() createUserDto: CreateUserDto) : Promise<UserResponseDTO> {
    return await this.usersService.registerUser(createUserDto);
  }
}
