"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async registerCandidate(dto) {
        if (!dto.email && !dto.phone) {
            throw new common_1.BadRequestException('Debes proporcionar email o teléfono.');
        }
        const existing = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: dto.email ?? '' },
                    { phone: dto.phone ?? '' },
                ].filter((c) => Object.values(c).some(Boolean)),
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('El usuario ya existe.');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                phone: dto.phone,
                passwordHash,
                role: 'candidate',
                candidateProfile: {
                    create: {
                        fullName: dto.fullName,
                        city: dto.city,
                        country: dto.country,
                        phone: dto.phone,
                        desiredJobType: dto.desiredJobType,
                        profileCompletion: 0,
                    },
                },
            },
            include: { candidateProfile: true },
        });
        return this.buildAuthResponse(user, user.candidateProfile?.id ?? null, null);
    }
    async login(dto) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: dto.identifier }, { phone: dto.identifier }],
            },
            include: { candidateProfile: true, companyUsers: true },
        });
        if (!user || !user.passwordHash) {
            throw new common_1.UnauthorizedException('Credenciales inválidas.');
        }
        const isValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Credenciales inválidas.');
        }
        const companyId = user.companyUsers[0]?.companyId ?? null;
        return this.buildAuthResponse(user, user.candidateProfile?.id ?? null, companyId);
    }
    async recoverAccess(dto) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: dto.identifier }, { phone: dto.identifier }],
            },
        });
        if (!user) {
            return {
                status: 'ok',
                message: 'Si el usuario existe, recibirá un código de recuperación.',
            };
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        const recovery = await this.prisma.passwordRecovery.create({
            data: {
                userId: user.id,
                code,
                expiresAt,
            },
        });
        return {
            recoveryId: recovery.id,
            expiresIn: 300,
            deliveryMethod: user.phone ? 'sms' : 'email',
        };
    }
    async verifyCode(dto) {
        const recovery = await this.prisma.passwordRecovery.findFirst({
            where: {
                id: dto.recoveryId,
                code: dto.code,
                usedAt: null,
                expiresAt: { gte: new Date() },
            },
        });
        if (!recovery) {
            throw new common_1.BadRequestException('Código inválido o expirado.');
        }
        const resetToken = this.jwtService.sign({ recoveryId: recovery.id, userId: recovery.userId }, { expiresIn: '15m' });
        return {
            resetToken,
            verified: true,
        };
    }
    async resetPassword(dto) {
        let payload;
        try {
            payload = this.jwtService.verify(dto.resetToken);
        }
        catch {
            throw new common_1.BadRequestException('Token inválido o expirado.');
        }
        const recovery = await this.prisma.passwordRecovery.findFirst({
            where: {
                id: payload.recoveryId,
                usedAt: null,
            },
        });
        if (!recovery) {
            throw new common_1.BadRequestException('Solicitud de recuperación ya utilizada.');
        }
        const passwordHash = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: payload.userId },
                data: { passwordHash },
            }),
            this.prisma.passwordRecovery.update({
                where: { id: recovery.id },
                data: { usedAt: new Date() },
            }),
        ]);
        return {
            status: 'ok',
            message: 'Contraseña actualizada correctamente.',
        };
    }
    async getMe(user) {
        return this.prisma.user.findUnique({
            where: { id: user.id },
            include: { candidateProfile: true, companyUsers: true },
        });
    }
    buildAuthResponse(user, candidateId, companyId) {
        const payload = {
            sub: user.id,
            role: user.role,
            candidateId,
            companyId,
        };
        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone,
                role: user.role,
                candidateId,
                companyId,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map