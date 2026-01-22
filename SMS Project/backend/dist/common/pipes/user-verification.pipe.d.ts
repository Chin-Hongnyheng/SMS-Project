import { PipeTransform } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
export declare class VerifyUserPipe implements PipeTransform {
    private readonly usersService;
    constructor(usersService: UsersService);
    transform(value: CreateUserDto): Promise<CreateUserDto>;
}
