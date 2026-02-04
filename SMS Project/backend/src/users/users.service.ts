// users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  private blockedNames = [
    'admin',
    'root',
    'system',
    'superadmin',
    'support',
    'null',
    'defined',
    'undefined',
    'teacher',
    'student',
  ];

  isBlockedName(name: string): boolean {
    return this.blockedNames.includes(name.toLowerCase());
  }

  async findByEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return !!user;
  }

  async findByUsername(userName: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { userName } });
    return !!user;
  }

  // CREATE
  async createUser(dto: CreateUserDto) {
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  // GET ALL
  async findAll() {
    return this.userRepository.find();
  }

  // GET BY ID
  async findById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  // UPDATE
  async updateUser(id: number, dto: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user) return null;
    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  // DELETE
  async deleteUser(id: number) {
    const user = await this.findById(id);
    if (!user) return null;
    await this.userRepository.remove(user);
    return true;
  }
}
