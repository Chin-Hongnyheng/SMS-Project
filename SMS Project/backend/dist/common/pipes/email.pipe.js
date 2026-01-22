"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailPipe = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../users/users.service");
let EmailPipe = class EmailPipe {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async transform(value) {
        if (typeof value !== 'string') {
            throw new common_1.BadRequestException('Invalid Username');
        }
        const trim = value.trim().toLowerCase();
        if (!trim) {
            throw new common_1.BadRequestException('Email cannot be empty');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trim)) {
            throw new common_1.BadRequestException('Invalid email format');
        }
        if (!trim.endsWith('@gmail.com')) {
            throw new common_1.BadRequestException('Email must end with @gmail.com');
        }
        const exists = await this.usersService.findByEmail(trim);
        if (exists) {
            throw new common_1.BadRequestException('Email already exists');
        }
        if (value[0] === ' ' || value[value.length - 1] === ' ') {
            throw new common_1.BadRequestException('Email cannot have spaces at start or end');
        }
        return trim;
    }
};
exports.EmailPipe = EmailPipe;
exports.EmailPipe = EmailPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], EmailPipe);
//# sourceMappingURL=email.pipe.js.map