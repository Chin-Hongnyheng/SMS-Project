import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfo } from './entities/userinfo.entity';
import { UserInfoService } from './userinfo.service';
import { UserInfoController } from './userinfo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserInfo]),
  ],
  providers: [UserInfoService],
  controllers: [UserInfoController],
  exports: [UserInfoService]
})
export class UserInfoModule {}
