-- Add check constraints to Transaction table to ensure amount is valid
ALTER TABLE "Transaction" 
ADD CONSTRAINT "Transaction_amount_positive" CHECK (amount > 0);

ALTER TABLE "Transaction" 
ADD CONSTRAINT "Transaction_amount_max" CHECK (amount <= 100000);

-- Add check constraint to Budget table limit
ALTER TABLE "Budget" 
ADD CONSTRAINT "Budget_limit_positive" CHECK ("limit" > 0);
