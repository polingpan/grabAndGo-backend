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
exports.AuthService = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const mail_service_1 = require("../mail-service/mail.service");
const users_service_1 = require("../users/users.service");
const uuid_1 = require("uuid");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const business_users_service_1 = require("../business-users/business-users.service");
let AuthService = class AuthService {
    constructor(cacheManager, userService, emailService, jwtService, businessUserService) {
        this.cacheManager = cacheManager;
        this.userService = userService;
        this.emailService = emailService;
        this.jwtService = jwtService;
        this.businessUserService = businessUserService;
    }
    async signUp(createUserDto) {
        const existingUser = await this.userService.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new Error('Email is already in use.');
        }
        const verificationToken = (0, uuid_1.v4)();
        await this.cacheManager.set(`user_${verificationToken}`, createUserDto, 1800);
        await this.emailService.sendSignUpVerificationEmail(createUserDto, verificationToken);
        return { message: 'Verification email sent. Please verify your email.' };
    }
    async verifyEmail(token) {
        const cachedUser = await this.cacheManager.get(`user_${token}`);
        if (!cachedUser) {
            return { message: 'Verification token is invalid or has expired.' };
        }
        await this.userService.create(cachedUser);
        await this.cacheManager.del(`user_${token}`);
        return { message: 'Email verified successfully.' };
    }
    async login(email, password) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password.');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid email or password.');
        }
        const payload = { userId: user._id, email: user.email };
        return this.jwtService.sign(payload);
    }
    async initBussinessSignup(createBusinessUserDto) {
        const existingUser = await this.businessUserService.findByEmail(createBusinessUserDto.email);
        if (existingUser) {
            throw new Error('Email is already in use.');
        }
        const verificationToken = (0, uuid_1.v4)();
        await this.cacheManager.set(`businessUser_${verificationToken}`, createBusinessUserDto, 1800);
        await this.emailService.sendBusinessVerificationEmail(createBusinessUserDto.email, verificationToken);
        return { message: 'Verification email sent. Please verify your email.' };
    }
    async verifyBusinessEmail(token) {
        const cachedBusinessUser = await this.cacheManager.get(`businessUser_${token}`);
        if (!cachedBusinessUser) {
            throw new Error('Verification token is invalid or has expired.');
        }
        return cachedBusinessUser;
    }
    async completeBusinessSignup(token, password) {
        const cachedBusinessUser = await this.cacheManager.get(`businessUser_${token}`);
        if (!cachedBusinessUser) {
            throw new Error('Verification token is invalid or has expired.');
        }
        const businessUserData = {
            ...cachedBusinessUser,
            password: password,
        };
        const businessUser = await this.businessUserService.create(businessUserData);
        await this.cacheManager.del(`businessUser_${token}`);
        return businessUser;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, users_service_1.UsersService,
        mail_service_1.EmailService,
        jwt_1.JwtService,
        business_users_service_1.BusinessUsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map