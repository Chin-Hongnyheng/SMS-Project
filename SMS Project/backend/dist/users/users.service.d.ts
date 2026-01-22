import { Repository } from 'typeorm';
import { Users } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<Users>);
    private blockedNames;
    isBlockedName(name: string): boolean;
    findByEmail(email: string): Promise<boolean>;
    findByUsername(userName: string): Promise<boolean>;
    createUser(dto: CreateUserDto): Promise<Users>;
    findAll(): Promise<Users[]>;
    findById(id: number): Promise<Users | null>;
    updateUser(id: number, dto: UpdateUserDto): Promise<Users | null>;
    deleteUser(id: number): Promise<true | null>;
}
