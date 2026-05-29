import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
export class CreateVariantDto {
    
@IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @IsNotEmpty()
  stock!: number;

  @IsNumber()
  @IsOptional() // Opcional según tu esquema (Float?)
  price?: number;

  @IsNumber()
  @IsNotEmpty()
  productId!: number;
}

