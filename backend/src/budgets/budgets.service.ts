import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

  async create(createBudgetDto: CreateBudgetDto) {
    // Validate inputs
    if (!createBudgetDto.limit || createBudgetDto.limit <= 0) {
      throw new BadRequestException('Budget limit must be greater than 0');
    }
    if (createBudgetDto.month < 1 || createBudgetDto.month > 12) {
      throw new BadRequestException('Month must be between 1 and 12');
    }
    if (createBudgetDto.year < 2000 || createBudgetDto.year > 2100) {
      throw new BadRequestException('Year must be reasonable');
    }

    try {
      return await this.prisma.budget.create({
        data: createBudgetDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Budget for ${createBudgetDto.category} in month ${createBudgetDto.month} already exists`,
          );
        }
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.budget.findMany();
  }

  async findByMonthAndYear(month: number, year: number) {
    return await this.prisma.budget.findMany({
      where: {
        month,
        year,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.budget.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateBudgetDto: UpdateBudgetDto) {
    if (updateBudgetDto.limit !== undefined && updateBudgetDto.limit <= 0) {
      throw new BadRequestException('Budget limit must be greater than 0');
    }

    try {
      return await this.prisma.budget.update({
        where: { id },
        data: updateBudgetDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Budget not found');
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.budget.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Budget not found');
        }
      }
      throw error;
    }
  }

  async findByCategory(category: string, month: number, year: number) {
    return await this.prisma.budget.findUnique({
      where: {
        category_month_year: {
          category,
          month,
          year,
        },
      },
    });
  }
}
