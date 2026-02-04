// users.controller.ts
import { 
  Controller, 
  Post, 
  Get, 
  Patch, 
  Delete, 
  Param, 
  ParseIntPipe, 
  Body, 
  NotFoundException, 
  UsePipes 
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyUserPipe } from 'src/common/pipes/user-verification.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  // CREATE USER
  @Post()
  @UsePipes(VerifyUserPipe)
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.service.createUser(body);
    return { ok: true, user };
  }

  // GET ALL USERS
  @Get()
  async getAllUsers() {
    const users = await this.service.findAll();
    return { ok: true, users };
  }

  // GET ONE USER BY ID
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.service.findById(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return { ok: true, user };
  }

  // UPDATE USER BY ID
  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    const updated = await this.service.updateUser(id, body);
    if (!updated) throw new NotFoundException(`User with ID ${id} not found`);
    return { ok: true, updated };
  }

  // DELETE USER BY ID
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.service.deleteUser(id);
    if (!deleted) throw new NotFoundException(`User with ID ${id} not found`);
    return { ok: true, message: `User with ID ${id} deleted` };
  }
}
