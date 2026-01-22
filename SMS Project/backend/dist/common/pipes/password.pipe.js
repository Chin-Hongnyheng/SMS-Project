"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordPipe = void 0;
const common_1 = require("@nestjs/common");
let PasswordPipe = class PasswordPipe {
    transform(value) {
        if (typeof value !== 'string') {
            throw new common_1.BadRequestException('Invalid password');
        }
        const trim = value.trim();
        if (!trim) {
            throw new common_1.BadRequestException('Password cannot be empty');
        }
        if (trim.length < 8) {
            throw new common_1.BadRequestException('Password must be at least 8 characters');
        }
        if (trim.length > 32) {
            throw new common_1.BadRequestException('Password must be at most 32 characters');
        }
        if (!/[A-Z]/.test(trim)) {
            throw new common_1.BadRequestException('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(trim)) {
            throw new common_1.BadRequestException('Password must contain at least one lowercase letter');
        }
        if (!/[0-9]/.test(trim)) {
            throw new common_1.BadRequestException('Password must contain at least one number');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(trim)) {
            throw new common_1.BadRequestException('Password must contain at least one special character');
        }
        if (/\s/.test(trim)) {
            throw new common_1.BadRequestException('Password cannot contain spaces');
        }
        if (value[0] === ' ' || value[value.length - 1] === ' ') {
            throw new common_1.BadRequestException('Password cannot have spaces at start or end');
        }
        return trim;
    }
};
exports.PasswordPipe = PasswordPipe;
exports.PasswordPipe = PasswordPipe = __decorate([
    (0, common_1.Injectable)()
], PasswordPipe);
//# sourceMappingURL=password.pipe.js.map