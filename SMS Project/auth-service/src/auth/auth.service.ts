import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

import { User } from '../entities/users.entity';
import { UserRole } from '../entities/user-role.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { Role } from 'src/entities/roles.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Role) private readonly roles: Repository<Role>,
    @InjectRepository(UserRole) private readonly userRoles: Repository<UserRole>,
    @InjectRepository(RolePermission) private readonly rolePerms: Repository<RolePermission>,
    @InjectRepository(RefreshToken) private readonly refreshTokens: Repository<RefreshToken>,
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
  const user = await this.users.findOne({ where: { email } });
  return !!user;
}

  async findByUsername(username: string): Promise<boolean> {
    const user = await this.users.findOne({ where: { username } });
    return !!user;
  }
  // --- REGISTER ---
  async register(dto: RegisterDto) {
    const { username, email, password, confirmPassword, role } = dto;
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user
    const user = this.users.create({
        username,
        email,
        passwordHash,
        isActive: true,
    });
    await this.users.save(user);

    // Determine role to assign
    const roleName = role?.toLowerCase() || 'user'; // default to 'user'
    const roleEntity = await this.roles.findOne({ where: { name: roleName } });
    if (!roleEntity) {
        throw new BadRequestException(`Role "${roleName}" not found`);
    }

    // Assign role
    const userRole = this.userRoles.create({
        user: { id: user.id },
        role: { id: roleEntity.id },
    });
    await this.userRoles.save(userRole);

    return { message: `User registered successfully with role "${roleName}"` };
}


  // --- LOGIN ---
  async login(dto: LoginDto) {
    const { username, password } = dto;

    const user = await this.users.findOne({ where: { username } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    // Fetch roles
    const roles = await this.userRoles.find({
      where: { user: { id: user.id } },
      relations: { role: true },
    });
    const roleNames = roles.map((r) => r.role.name);

    // Fetch permissions
    const roleIds = roles.map((r) => r.role.id);
    const perms = await this.rolePerms
      .createQueryBuilder('rp')
      .leftJoinAndSelect('rp.permission', 'permission')
      .where('rp.roleId IN (:...roleIds)', { roleIds })
      .getMany();

    const permissionKeys = [...new Set(perms.map((p) => p.permission.key))];

    // Generate access token
    const accessToken = await this.jwt.signAsync(
      {
        sub: user.id,
        username: user.username,
        email: user.email,
        roles: roleNames,
        permissions: permissionKeys,
      },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRES as any || '15m',
      },
    );

    // Generate refresh token
    const refreshToken = randomBytes(48).toString('hex');
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokens.save(
      this.refreshTokens.create({
        user: { id: user.id },
        tokenHash: refreshTokenHash,
        expiresAt,
      }),
    );

    return { accessToken, refreshToken };
  }

}
