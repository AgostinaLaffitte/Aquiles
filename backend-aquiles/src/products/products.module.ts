import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  controllers: [ProductsController,CloudinaryModule],
  providers: [ProductsService],
})
export class ProductsModule {}
