import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class ApplicationService {
  constructor(private prisma: PrismaService) {}

  private generateReferenceNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `REF-${timestamp}-${random}`;
  }

  async create(createApplicationDto: CreateApplicationDto) {
    const referenceNumber = this.generateReferenceNumber();

    const application = await this.prisma.application.create({
      data: {
        referenceNumber,
        serviceType: createApplicationDto.serviceType,
        formData: createApplicationDto.formData,
        status: 'PENDING',
      },
    });

    return {
      success: true,
      referenceNumber: application.referenceNumber,
      message: 'Application submitted successfully',
      application: {
        id: application.id,
        referenceNumber: application.referenceNumber,
        serviceType: application.serviceType,
        status: application.status,
        createdAt: application.createdAt,
      },
    };
  }

  async getStatus(referenceNumber: string) {
    const application = await this.prisma.application.findUnique({
      where: { referenceNumber },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return {
      success: true,
      application: {
        referenceNumber: application.referenceNumber,
        serviceType: application.serviceType,
        status: application.status,
        formData: application.formData,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
      },
    };
  }

  async updateStatus(referenceNumber: string, updateStatusDto: UpdateStatusDto) {
    const application = await this.prisma.application.findUnique({
      where: { referenceNumber },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const updated = await this.prisma.application.update({
      where: { referenceNumber },
      data: { status: updateStatusDto.status },
    });

    return {
      success: true,
      message: 'Status updated successfully',
      application: {
        referenceNumber: updated.referenceNumber,
        serviceType: updated.serviceType,
        status: updated.status,
        updatedAt: updated.updatedAt,
      },
    };
  }

  async getAll() {
    const applications = await this.prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      count: applications.length,
      applications: applications.map(app => ({
        id: app.id,
        referenceNumber: app.referenceNumber,
        serviceType: app.serviceType,
        status: app.status,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
      })),
    };
  }
}
