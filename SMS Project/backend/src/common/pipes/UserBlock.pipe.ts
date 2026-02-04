import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { CreateUserDto } from "src/users/dto/create-user.dto";

@Injectable()
export class UserBlock implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}

  transform(value: CreateUserDto) {
    value.userName = value.userName?.trim();

    if (
      value.userName &&
      this.usersService.isBlockedName(value.userName)
    ) {
      throw new BadRequestException('This userName is blocked');
    }

    return value;
  }
}
