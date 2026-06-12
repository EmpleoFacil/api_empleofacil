export declare class CreateJobDto {
    title: string;
    categoryId?: string;
    customCategory?: string;
    description?: string;
    requirements?: string[];
    benefits?: string[];
    city?: string;
    country?: string;
    salaryMin?: number;
    salaryMax?: number;
    employmentType?: string;
    modality?: string;
    status?: string;
    expiresAt?: string;
    companyId?: string;
}
