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
exports.VerifyUserPipe = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../users/users.service");
const username_pipe_1 = require("./username.pipe");
const email_pipe_1 = require("./email.pipe");
const password_pipe_1 = require("./password.pipe");
const UserBlock_pipe_1 = require("./UserBlock.pipe");
let VerifyUserPipe = class VerifyUserPipe {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async transform(value) {
        if (!value)
            throw new common_1.BadRequestException('Request body is required');
        const usernamePipe = new username_pipe_1.UsernamePipe(this.usersService);
        const emailPipe = new email_pipe_1.EmailPipe(this.usersService);
        const passwordPipe = new password_pipe_1.PasswordPipe();
        const userBlockPipe = new UserBlock_pipe_1.UserBlock(this.usersService);
        value.userName = await usernamePipe.transform(value.userName);
        value.email = await emailPipe.transform(value.email);
        value.password = passwordPipe.transform(value.password);
        value = userBlockPipe.transform(value);
        return value;
    }
};
exports.VerifyUserPipe = VerifyUserPipe;
exports.VerifyUserPipe = VerifyUserPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], VerifyUserPipe);
//# sourceMappingURL=user-verification.pipe.js.map