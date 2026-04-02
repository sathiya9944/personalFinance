import { IsString, IsNumber, IsOptional, IsPositive, Max, Min, Matches, IsIn } from 'class-validator';

export class UpdateTransactionDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @Matches(/^[a-zA-Z\s\-']+$/, { 
    message: 'Title must contain only English alphabets, spaces, hyphens, and apostrophes' 
  })
  title?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Amount must be a number' })
  @IsPositive({ message: 'Amount must be greater than 0' })
  @Min(0.01, { message: 'Minimum amount is ₹0.01' })
  @Max(100000, { message: 'Amount cannot exceed ₹100,000' })
  amount?: number;

  @IsOptional()
  @IsString({ message: 'Type must be a string' })
  @IsIn(['income', 'expense'], { message: 'Type must be either "income" or "expense"' })
  type?: string;

  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  @Matches(/^[a-zA-Z\s\-]+$/, { 
    message: 'Category must contain only English alphabets, spaces, and hyphens' 
  })
  category?: string;
}
