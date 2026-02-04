import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { Role } from 'src/entities/roles.entity';
import { Permission } from 'src/entities/permissions.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { RolePermission } from 'src/entities/role-permission.entity';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  imports:[
    TypeOrmModule.forFeature([User, Role, Permission, UserRole, RolePermission, RefreshToken]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard, PermissionsGuard],
  exports: [AuthService],
})
export class AuthModule {}
