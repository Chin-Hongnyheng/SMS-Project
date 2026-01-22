import { PipeTransform } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
export declare class UsernamePipe implements PipeTransform {
    private readonly usersService;
    constructor(usersService: UsersService);
    transform(value: any): Promise<string>;
}
