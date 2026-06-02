import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from '../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RecoverAccessDto } from './dto/recover-access.dto';
import { RegisterCandidateDto } from './dto/register-candidate.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly config;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService);
    registerCandidate(dto: RegisterCandidateDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string | null;
            phone: string | null;
            role: string;
            candidateId: string | null;
            companyId: string | null;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string | null;
            phone: string | null;
            role: string;
            candidateId: string | null;
            companyId: string | null;
        };
    }>;
    recoverAccess(dto: RecoverAccessDto): Promise<{
        status: string;
        message: string;
    } | {
        deliveryMethod: string;
        debugCode?: undefined;
        recoveryId: string;
        expiresIn: number;
        status?: undefined;
        message?: undefined;
    } | {
        deliveryMethod: string;
        debugCode: string;
        recoveryId: string;
        expiresIn: number;
        status?: undefined;
        message?: undefined;
    }>;
    verifyCode(dto: VerifyCodeDto): Promise<{
        resetToken: string;
        verified: boolean;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        status: string;
        message: string;
    }>;
    getMe(user: AuthUser): Promise<({
        candidateProfile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            status: import(".prisma/client").$Enums.UserStatus;
            fullName: string;
            city: string | null;
            country: string | null;
            desiredJobType: string | null;
            availability: string | null;
            salaryExpectationMin: number | null;
            salaryExpectationMax: number | null;
            experienceLevel: string | null;
            educationLevel: string | null;
            profileCompletion: number;
            userId: string;
        } | null;
        companyUsers: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.CompanyRole;
            companyId: string;
            userId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        phone: string | null;
        passwordHash: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
    }) | null>;
    private buildAuthResponse;
    private deliverRecoveryCode;
}
