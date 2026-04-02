import { IsString, IsNumber, IsPositive, Max, Min, IsNotEmpty, Matches, IsIn } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @Matches(/^[a-zA-Z\s\-']+$/, {
    message: 'Title must contain only English alphabets, spaces, hyphens, and apostrophes'
  })
  title: string;

  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber({}, { message: 'Amount must be a number' })
  @IsPositive({ message: 'Amount must be greater than 0' })
  @Min(0.01, { message: 'Minimum amount is ₹0.01' })
  @Max(1000000, { message: 'Amount cannot exceed ₹100,0000' })
  amount: number;

  @IsNotEmpty({ message: 'Type is required' })
  @IsString({ message: 'Type must be a string' })
  @IsIn(['income', 'expense'], { message: 'Type must be either "income" or "expense"' })
  type: string;

  @IsNotEmpty({ message: 'Category is required' })
  @IsString({ message: 'Category must be a string' })
  @Matches(/^[a-zA-Z\s\-]+$/, {
    message: 'Category must contain only English alphabets, spaces, and hyphens'
  })
  category: string;
}