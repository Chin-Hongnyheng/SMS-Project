import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsernamePipe implements PipeTransform {
  constructor(private readonly usersService: AuthService) {}

  async transform(value: any) {
    // 1. Check if value is a string
    if (typeof value !== 'string') {
      throw new BadRequestException('Invalid Username');
    }

    const trimmed = value.trim();

    // 2. Check if empty
    if (!trimmed) {
      throw new BadRequestException('Username cannot be empty');
    }

    // 3. Length check
    if (trimmed.length < 5) {
      throw new BadRequestException('Username must be at least 5 characters');
    }
    if (trimmed.length > 20) {
      throw new BadRequestException('Username must be at most 20 characters');
    }

    // 4. Allowed characters (letters, numbers, underscore)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(trimmed)) {
      throw new BadRequestException(
        'Username can only contain letters, numbers, and underscores',
      );
    }

    // 5. No spaces at start/end (already trimmed)
    if (value[0] === ' ' || value[value.length - 1] === ' ') {
      throw new BadRequestException('Username cannot have spaces at start or end');
    }

    // 6. Async DB check: username already exists
    const exists = await this.usersService.findByUsername(trimmed);
    if (exists) {
      throw new BadRequestException('Username already exists');
    }

    // 7. Return cleaned, validated value
    return trimmed;
  }
}
