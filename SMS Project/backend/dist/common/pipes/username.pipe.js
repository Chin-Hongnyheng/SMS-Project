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
exports.UsernamePipe = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../users/users.service");
let UsernamePipe = class UsernamePipe {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async transform(value) {
        if (typeof value !== 'string') {
            throw new common_1.BadRequestException('Invalid Username');
        }
        const trimmed = value.trim();
        if (!trimmed) {
            throw new common_1.BadRequestException('Username cannot be empty');
        }
        if (trimmed.length < 5) {
            throw new common_1.BadRequestException('Username must be at least 5 characters');
        }
        if (trimmed.length > 20) {
            throw new common_1.BadRequestException('Username must be at most 20 characters');
        }
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(trimmed)) {
            throw new common_1.BadRequestException('Username can only contain letters, numbers, and underscores');
        }
        if (value[0] === ' ' || value[value.length - 1] === ' ') {
            throw new common_1.BadRequestException('Username cannot have spaces at start or end');
        }
        const exists = await this.usersService.findByUsername(trimmed);
        if (exists) {
            throw new common_1.BadRequestException('Username already exists');
        }
        return trimmed;
    }
};
exports.UsernamePipe = UsernamePipe;
exports.UsernamePipe = UsernamePipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsernamePipe);
//# sourceMappingURL=username.pipe.js.map