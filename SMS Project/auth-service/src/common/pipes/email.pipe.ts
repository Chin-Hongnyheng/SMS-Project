import { BadRequestException,Injectable, PipeTransform } from '@nestjs/common'
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class EmailPipe implements PipeTransform {
    constructor(private readonly usersService: AuthService){}
    async transform(value: any){
        //1. Check whether is it a string or not
        if (typeof value !== 'string'){
            throw new BadRequestException('Invalid email');
        }

        //2. Check empty
        const trim = value.trim().toLowerCase();
        if(!trim){
            throw new BadRequestException('Email cannot be empty');
        }

        //3. Validate format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(trim)){
            throw new BadRequestException('Invalid email format')
        }

         // 4. Restrict to @gmail.com
        if (!trim.endsWith('@gmail.com')) {
            throw new BadRequestException('Email must end with @gmail.com');
        }

        // 5. Async DB check: email already exists
        const exists = await this.usersService.findByEmail(trim);
        if (exists) {
            throw new BadRequestException('Email already exists');
        }

        // 5. No spaces at start/end (already trimmed)
        if (value[0] === ' ' || value[value.length - 1] === ' ') {
            throw new BadRequestException('Email cannot have spaces at start or end');
        }

        return trim;
    }
}