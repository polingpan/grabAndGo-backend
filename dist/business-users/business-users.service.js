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
exports.BusinessUsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const business_user_schema_1 = require("./business-user.schema");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
let BusinessUsersService = class BusinessUsersService {
    constructor(businessUserModel) {
        this.businessUserModel = businessUserModel;
    }
    async create(businessUserData) {
        const hashedPassword = await bcrypt.hash(businessUserData.password, parseInt(process.env.SALT_ROUNDS));
        businessUserData.password = hashedPassword;
        const businessUser = await this.businessUserModel.create(businessUserData);
        return businessUser;
    }
    async findByEmail(email) {
        const businessUser = await this.businessUserModel.findOne({ email }).exec();
        return businessUser;
    }
};
exports.BusinessUsersService = BusinessUsersService;
exports.BusinessUsersService = BusinessUsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(business_user_schema_1.BusinessUser.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BusinessUsersService);
//# sourceMappingURL=business-users.service.js.map