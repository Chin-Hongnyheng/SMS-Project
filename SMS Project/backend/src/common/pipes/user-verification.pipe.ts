import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { UsernamePipe } from './username.pipe';
import { EmailPipe } from './email.pipe';
import { PasswordPipe } from './password.pipe';
import { UserBlock } from './UserBlock.pipe';

@Injectable()
export class VerifyUserPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}

  async transform(value: CreateUserDto): Promise<CreateUserDto> {
    if (!value) throw new BadRequestException('Request body is required');

    // create pipe instances manually
    const usernamePipe = new UsernamePipe(this.usersService);
    const emailPipe = new EmailPipe(this.usersService);
    const passwordPipe = new PasswordPipe();
    const userBlockPipe = new UserBlock(this.usersService);

    // run validations
    value.userName = await usernamePipe.transform(value.userName);
    value.email = await emailPipe.transform(value.email);
    value.password = passwordPipe.transform(value.password);
    value = userBlockPipe.transform(value);

    return value;
  }
}
