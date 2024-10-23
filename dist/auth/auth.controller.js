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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("../dto/auth.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async signUp(createUserDto, res) {
        try {
            await this.authService.signUp(createUserDto);
            return res.status(200).json({
                statusCode: 200,
                message: 'Verification email sent. Please check your inbox to verify.',
            });
        }
        catch (err) {
            return res.status(500).json({
                statusCode: 500,
                error: err.message,
            });
        }
    }
    async login(loginDto, res) {
        try {
            const result = await this.authService.login(loginDto.email, loginDto.password);
            return res.status(200).json({
                statusCode: 200,
                message: 'Login successful',
                token: result,
            });
        }
        catch (error) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Invalid email or password.',
                error: error.message,
            });
        }
    }
    async verifyEmail(token, res) {
        try {
            const result = await this.authService.verifyEmail(token);
            if (!result) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Verification token is invalid or has expired.',
                });
            }
            return res.status(200).json({
                statusCode: 200,
                message: 'Email verified successfully, account created.',
            });
        }
        catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: 'Error occurred during email verification. Please try again later.',
                error: error.message,
            });
        }
    }
    async initBussinessSignup(createBusinessUserDto, res) {
        try {
            const result = await this.authService.initBussinessSignup(createBusinessUserDto);
            return res.status(200).json({
                statusCode: 200,
                message: result.message,
            });
        }
        catch (error) {
            return res.status(500).json({
                statusCode: 500,
                error: error.message,
            });
        }
    }
    async verifyBusinessEmail(token, res) {
        try {
            const cachedBusinessUser = await this.authService.verifyBusinessEmail(token);
            return res.status(200).json({
                statusCode: 200,
                message: 'Email verified successfully. Please set your password.',
                data: cachedBusinessUser,
            });
        }
        catch (error) {
            return res.status(400).json({
                statusCode: 400,
                error: error.message,
            });
        }
    }
    async completeBusinessSignup(token, password, res) {
        try {
            const businessUser = await this.authService.completeBusinessSignup(token, password);
            return res.status(201).json({
                statusCode: 201,
                message: 'Business user created successfully.',
                user: {
                    storeName: businessUser.storeName,
                    email: businessUser.email,
                    phoneNumber: businessUser.phoneNumber,
                    storeAddress: businessUser.storeAddress,
                },
            });
        }
        catch (error) {
            return res.status(400).json({
                statusCode: 400,
                error: error.message,
            });
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('verify/:token'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('business-Signup'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.CreateBusinessUserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "initBussinessSignup", null);
__decorate([
    (0, common_1.Get)('business-verify/:token'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyBusinessEmail", null);
__decorate([
    (0, common_1.Post)('complete-business-signup/:token'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)('password')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "completeBusinessSignup", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map