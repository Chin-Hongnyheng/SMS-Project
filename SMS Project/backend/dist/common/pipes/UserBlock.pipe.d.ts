import { PipeTransform } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { CreateUserDto } from "src/users/dto/create-user.dto";
export declare class UserBlock implements PipeTransform {
    private readonly usersService;
    constructor(usersService: UsersService);
    transform(value: CreateUserDto): CreateUserDto;
}
