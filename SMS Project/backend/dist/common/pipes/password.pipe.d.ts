import { PipeTransform } from '@nestjs/common';
export declare class PasswordPipe implements PipeTransform {
    transform(value: any): string;
}
