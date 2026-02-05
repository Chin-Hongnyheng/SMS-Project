import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { RegisterDto } from "src/auth/dto/register.dto";

@Injectable()
export class UserBlock implements PipeTransform {
  constructor(private readonly usersService: AuthService) {}

  transform(value: RegisterDto) {
    value.username = value.username?.trim();

    if (
      value.username &&
      this.usersService.isBlockedName(value.username)
    ) {
      throw new BadRequestException('This userName is blocked');
    }

    return value;
  }
}
