import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateTransactionDto) {
    return this.prisma.transaction.create({ data });
  }

  findAll() {
    return this.prisma.transaction.findMany();
  }

  delete(id: number) {
    return this.prisma.transaction.delete({ where: { id } });
  }
}