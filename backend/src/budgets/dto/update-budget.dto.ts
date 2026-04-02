import { IsNumber, IsPositive, Max, Min, IsOptional } from 'class-validator';

export class UpdateBudgetDto {
  @IsOptional()
  @IsNumber({}, { message: 'Limit must be a number' })
  @IsPositive({ message: 'Limit must be greater than 0' })
  @Min(0.01, { message: 'Minimum limit is ₹0.01' })
  @Max(100000, { message: 'Limit cannot exceed ₹100,000' })
  limit?: number;
}
