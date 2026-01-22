import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly service;
    constructor(service: UsersService);
    createUser(body: CreateUserDto): Promise<{
        ok: boolean;
        user: import("./entity/user.entity").Users;
    }>;
    getAllUsers(): Promise<{
        ok: boolean;
        users: import("./entity/user.entity").Users[];
    }>;
    getUserById(id: number): Promise<{
        ok: boolean;
        user: import("./entity/user.entity").Users;
    }>;
    updateUser(id: number, body: UpdateUserDto): Promise<{
        ok: boolean;
        updated: import("./entity/user.entity").Users;
    }>;
    deleteUser(id: number): Promise<{
        ok: boolean;
        message: string;
    }>;
}
