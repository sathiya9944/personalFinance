import { IsString, IsNumber, IsPositive, Max, Min, IsNotEmpty, Matches, IsInt } from 'class-validator';

export class CreateBudgetDto {
  @IsNotEmpty({ message: 'Category is required' })
  @IsString({ message: 'Category must be a string' })
  @Matches(/^[a-zA-Z\s\-]+$/, { 
    message: 'Category must contain only English alphabets, spaces, and hyphens' 
  })
  category: string;

  @IsNotEmpty({ message: 'Limit is required' })
  @IsNumber({}, { message: 'Limit must be a number' })
  @IsPositive({ message: 'Limit must be greater than 0' })
  @Min(0.01, { message: 'Minimum limit is ₹0.01' })
  @Max(100000, { message: 'Limit cannot exceed ₹100,000' })
  limit: number;

  @IsNotEmpty({ message: 'Month is required' })
  @IsInt({ message: 'Month must be an integer' })
  @Min(1, { message: 'Month must be between 1 and 12' })
  @Max(12, { message: 'Month must be between 1 and 12' })
  month: number;

  @IsNotEmpty({ message: 'Year is required' })
  @IsInt({ message: 'Year must be an integer' })
  @Min(2000, { message: 'Year must be valid' })
  year: number;
}
