import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInfo } from './entities/userinfo.entity';
import { CreateUserInfoDto } from './dto/create-userinfo.dto';

@Injectable()
export class UserInfoService {
  constructor(
    @InjectRepository(UserInfo)
    private readonly userInfoRepository: Repository<UserInfo>,
  ) {}

  async create(createUserInfoDto: CreateUserInfoDto): Promise<UserInfo> {
    const userInfo = this.userInfoRepository.create(createUserInfoDto);
    return await this.userInfoRepository.save(userInfo);
  }

  async findAll(): Promise<UserInfo[]> {
    return await this.userInfoRepository.find();
  }

  async findOne(id: number): Promise<UserInfo> {
    const userInfo = await this.userInfoRepository.findOne({ where: { id } });
    if (!userInfo) throw new NotFoundException(`UserInfo with id ${id} not found`);
    return userInfo;
  }

  async findByUserId(userId: number): Promise<UserInfo | null> {
    return this.userInfoRepository.findOne({ where: { userId } });
  }

  async update(id: number, updateData: Partial<CreateUserInfoDto>): Promise<UserInfo> {
    const userInfo = await this.findOne(id);
    Object.assign(userInfo, updateData);
    return await this.userInfoRepository.save(userInfo);
  }


  async remove(id: number): Promise<void> {
    const result = await this.userInfoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`UserInfo with id ${id} not found`);
    }
  }
}
