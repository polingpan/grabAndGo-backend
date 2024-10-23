"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let EmailService = class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'stmp.gmail.com',
            auth: {
                user: process.env.COMPANY_EMAIL,
                pass: process.env.COMPANY_EMAIL_PASSWORD,
            },
        });
    }
    async sendSignUpVerificationEmail(createUserDto, token) {
        const verificationUrl = `${token}`;
        const mailOptions = {
            from: process.env.COMPANY_EMAIL,
            to: createUserDto.email,
            subject: 'Verification Email',
            text: `Click on the following link to verify your account: ${verificationUrl}`,
        };
        await this.transporter.sendMail(mailOptions);
    }
    async sendBusinessVerificationEmail(email, token) {
        const verificationUrl = `${token}`;
        const mailOptions = {
            from: process.env.COMPANY_EMAIL,
            to: email,
            subject: 'Verification Email For Business',
            text: `Click on the following link to verify your account: ${verificationUrl}`,
        };
        await this.transporter.sendMail(mailOptions);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)()
], EmailService);
//# sourceMappingURL=mail.service.js.map