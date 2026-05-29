import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../common/types/auth-user';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchForCompany(user: AuthUser, query: string, type: string) {
    if (!user.companyId) {
      throw new ForbiddenException('Usuario sin empresa asignada');
    }

    const searchTerm = query.toLowerCase().trim();
    const results: Record<string, unknown[]> = {};

    if (type === 'all' || type === 'jobs') {
      const jobs = await this.prisma.job.findMany({
        where: {
          companyId: user.companyId,
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: 10,
        select: {
          id: true,
          title: true,
          status: true,
          city: true,
        },
      });
      results.jobs = jobs;
    }

    if (type === 'all' || type === 'candidates') {
      const applications = await this.prisma.application.findMany({
        where: {
          job: { companyId: user.companyId },
          candidate: {
            fullName: { contains: searchTerm, mode: 'insensitive' },
          },
        },
        take: 10,
        include: {
          candidate: {
            select: { id: true, fullName: true, city: true },
          },
          job: {
            select: { id: true, title: true },
          },
        },
      });
      results.candidates = applications.map((a) => ({
        applicationId: a.id,
        candidate: a.candidate,
        job: a.job,
        status: a.status,
      }));
    }

    if (type === 'all' || type === 'messages') {
      const messages = await this.prisma.message.findMany({
        where: {
          companyId: user.companyId,
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { body: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: 10,
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          createdAt: true,
        },
      });
      results.messages = messages;
    }

    return { data: results, query: searchTerm };
  }
}
