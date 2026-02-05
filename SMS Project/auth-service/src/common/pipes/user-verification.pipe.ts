import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { AuthService } from 'src/auth/auth.service';
import { UsernamePipe } from './username.pipe';
import { EmailPipe } from './email.pipe';
import { PasswordPipe } from './password.pipe';
import { UserBlock } from './UserBlock.pipe';

@Injectable()
export class VerifyUserPipe implements PipeTransform {
  constructor(
    private readonly usernamePipe: UsernamePipe,
    private readonly emailPipe: EmailPipe,
    private readonly passwordPipe: PasswordPipe,
    private readonly userBlockPipe: UserBlock,
  ) {}

  async transform(value: RegisterDto): Promise<RegisterDto> {
    if (!value) throw new BadRequestException('Request body is required');

    value.username = await this.usernamePipe.transform(value.username);
    value.email = await this.emailPipe.transform(value.email);
    value.password = this.passwordPipe.transform(value.password);
    value = this.userBlockPipe.transform(value);

    if (value.password !== value.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    return value;
  }
}

