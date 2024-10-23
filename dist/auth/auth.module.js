"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const mail_service_1 = require("../mail-service/mail.service");
const users_service_1 = require("../users/users.service");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../users/user.schema");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const business_user_schema_1 = require("../business-users/business-user.schema");
const business_users_service_1 = require("../business-users/business-users.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '2h' },
                }),
            }),
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
            mongoose_1.MongooseModule.forFeature([
                { name: business_user_schema_1.BusinessUser.name, schema: business_user_schema_1.BusinessUserSchema },
            ]),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, mail_service_1.EmailService, users_service_1.UsersService, business_users_service_1.BusinessUsersService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map