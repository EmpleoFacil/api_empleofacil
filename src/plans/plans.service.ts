import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlansService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const plans = await this.prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
    return { items: plans };
  }

  async create(dto: CreatePlanDto) {
    const plan = await this.prisma.plan.create({
      data: {
        id: dto.id,
        name: dto.name,
        price: dto.price,
        currency: dto.currency ?? 'NIO',
        publicationLimit: dto.publicationLimit,
        userLimit: dto.userLimit,
        visibleCandidatesLimit: dto.visibleCandidatesLimit,
      },
    });
    return { success: true, message: 'Plan creado correctamente', data: plan };
  }

  async update(id: string, dto: UpdatePlanDto) {
    const existing = await this.prisma.plan.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Plan no encontrado');
    }

    const plan = await this.prisma.plan.update({
      where: { id },
      data: dto,
    });
    return { success: true, message: 'Plan actualizado correctamente', data: plan };
  }

  async remove(id: string) {
    const existing = await this.prisma.plan.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Plan no encontrado');
    }

    await this.prisma.plan.update({
      where: { id },
      data: { isActive: false },
    });
    return { success: true, message: 'Plan eliminado correctamente' };
  }
}
