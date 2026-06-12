import { ForbiddenException, Injectable } from '@nestjs/common';
import type { AuthUser } from '../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getCompanyDashboard(user: AuthUser) {
    if (user.role !== 'super_admin' && !user.companyId) {
      throw new ForbiddenException('Usuario sin empresa asignada.');
    }

    const companyId = user.companyId!;
    await this.prisma.job.updateMany({
      where: {
        companyId,
        status: 'active',
        expiresAt: { lt: new Date() },
      },
      data: { status: 'closed' },
    });
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [activeJobs, totalApplications, interviewsWeek, messagesUnread,
           recentJobs, upcomingInterviews, recentMessages, company] = await Promise.all([
      this.prisma.job.count({ where: { companyId, status: 'active' } }),
      this.prisma.application.count({ where: { job: { companyId } } }),
      this.prisma.interview.count({ where: { companyId, date: { gte: sevenDaysAgo } } }),
      this.prisma.message.count({ where: { companyId, status: { in: ['sent', 'unread'] } } }),
      this.prisma.job.findMany({
        where: { companyId },
        select: { id: true, title: true, city: true, status: true, _count: { select: { applications: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.interview.findMany({
        where: { companyId, date: { gte: now } },
        include: { candidate: { select: { id: true, fullName: true } }, job: { select: { id: true, title: true } } },
        orderBy: { date: 'asc' },
        take: 5,
      }),
      this.prisma.message.findMany({
        where: { companyId, status: { in: ['sent', 'unread'] } },
        include: { candidate: { select: { id: true, fullName: true } } },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
      this.prisma.company.findUnique({ where: { id: companyId }, include: { plan: true } }),
    ]);

    const jobsThisMonth = await this.prisma.job.count({
      where: { companyId, createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) } },
    });

    return {
      kpis: {
        activeJobs: { value: activeJobs, trend: 25, period: '30d' },
        applications: { value: totalApplications, trend: 10, period: '30d' },
        interviewsWeek: { value: interviewsWeek, trend: 20, period: '7d' },
        messagesUnread: { value: messagesUnread, trend: -25, period: '7d' },
      },
      recentJobs: recentJobs.map(j => ({ ...j, applications: j._count.applications })),
      upcomingInterviews,
      recentMessages,
      company: { id: company?.id, name: company?.name },
      plan: {
        name: company?.plan?.name ?? 'Profesional',
        jobsThisMonth,
        maxJobs: company?.plan?.publicationLimit ?? 30,
      },
    };
  }

  async getAdminDashboard() {
    await this.prisma.job.updateMany({
      where: {
        status: 'active',
        expiresAt: { lt: new Date() },
      },
      data: { status: 'closed' },
    });

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [companies, candidates, jobs, applications, documentsPending, companiesPrev, candidatesPrev] = await Promise.all([
      this.prisma.company.count(),
      this.prisma.candidateProfile.count(),
      this.prisma.job.count({ where: { status: 'active' } }),
      this.prisma.application.count(),
      this.prisma.candidateDocument.count({ where: { status: { in: ['pending', 'uploaded'] } } }),
      this.prisma.company.count({ where: { createdAt: { lt: thirtyDaysAgo } } }),
      this.prisma.candidateProfile.count({ where: { createdAt: { lt: thirtyDaysAgo } } }),
    ]);

    const recentActivity = await this.prisma.application.findMany({
      select: { id: true, status: true, appliedAt: true, candidate: { select: { fullName: true } }, job: { select: { title: true, company: { select: { name: true } } } } },
      orderBy: { appliedAt: 'desc' },
      take: 10,
    });

    const calcTrend = (current: number, prev: number) => prev === 0 ? (current > 0 ? 100 : 0) : Math.round(((current - prev) / prev) * 100);

    return {
      kpis: {
        companies: { value: companies, trend: calcTrend(companies, companiesPrev) },
        candidates: { value: candidates, trend: calcTrend(candidates, candidatesPrev) },
        activeJobs: { value: jobs },
        applications: { value: applications },
        documentsPending: { value: documentsPending },
      },
      recentActivity,
      platformStatus: 'operational',
    };
  }
}
