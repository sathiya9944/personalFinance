import { IsString, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  title: string;

  @IsNumber()
  amount: number;

  @IsString()
  type: string;

  @IsString()
  category: string;
}