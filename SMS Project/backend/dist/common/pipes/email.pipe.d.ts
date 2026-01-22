import { PipeTransform } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
export declare class EmailPipe implements PipeTransform {
    private readonly usersService;
    constructor(usersService: UsersService);
    transform(value: any): Promise<string>;
}
