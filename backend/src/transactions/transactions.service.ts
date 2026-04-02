import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTransactionDto) {
    const transaction = await this.prisma.transaction.create({ data });

    if (data.type === 'expense') {
      const now = new Date();
      const month = now.getMonth() + 1; // 1-12
      const year = now.getFullYear();

      const budget = await this.prisma.budget.findFirst({
        where: { category: data.category, month, year },
      });

      if (budget) {
        // Find sum of all expenses for this category in the current month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        const expenses = await this.prisma.transaction.aggregate({
          _sum: { amount: true },
          where: {
            category: data.category,
            type: 'expense',
            createdAt: {
              gte: startDate,
              lt: endDate,
            },
          },
        });

        const total = expenses._sum.amount ? Number(expenses._sum.amount) : 0;
        const limit = Number(budget.limit);

        return {
          transaction,
          budgetExceeded: total > limit,
          category: data.category,
          limit,
          total,
        };
      }
    }

    return {
      transaction,
      budgetExceeded: false,
    };
  }

  findAll() {
    return this.prisma.transaction.findMany({ orderBy: { createdAt: 'desc' } });
  }

  update(id: number, data: UpdateTransactionDto) {
    return this.prisma.transaction.update({
      where: { id },
      data,
    });
  }

  delete(id: number) {
    return this.prisma.transaction.delete({ where: { id } });
  }
}