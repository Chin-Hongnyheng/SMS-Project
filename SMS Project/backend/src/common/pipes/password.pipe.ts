import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PasswordPipe implements PipeTransform {
  transform(value: any) {
    // 1. Must be string
    if (typeof value !== 'string') {
      throw new BadRequestException('Invalid password');
    }

    const trim = value.trim();

    // 2. Cannot be empty
    if (!trim) {
      throw new BadRequestException('Password cannot be empty');
    }

    // 3. Length check
    if (trim.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }
    if (trim.length > 32) {
      throw new BadRequestException('Password must be at most 32 characters');
    }

    // 4. Must contain uppercase
    if (!/[A-Z]/.test(trim)) {
      throw new BadRequestException('Password must contain at least one uppercase letter');
    }

    // 5. Must contain lowercase
    if (!/[a-z]/.test(trim)) {
      throw new BadRequestException('Password must contain at least one lowercase letter');
    }

    // 6. Must contain number
    if (!/[0-9]/.test(trim)) {
      throw new BadRequestException('Password must contain at least one number');
    }

    // 7. Must contain special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(trim)) {
      throw new BadRequestException('Password must contain at least one special character');
    }

    // 8. No spaces inside
    if (/\s/.test(trim)) {
      throw new BadRequestException('Password cannot contain spaces');
    }

    // 9. No spaces at start/end (already trimmed)
    if (value[0] === ' ' || value[value.length - 1] === ' ') {
      throw new BadRequestException('Password cannot have spaces at start or end');
    }

    return trim;
  }
}
