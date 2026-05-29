import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { VariantsModule } from './variants/variants.module';
import { ConfigModule } from '@nestjs/config'; 
import { OrdersModule } from './orders/orders.module';
import { BannersModule } from './banners/banners.module';
import { AuthModule } from './auth/auth.module';
import { PromotionsModule } from './promotions/promotions.module';
@Module({
 
  imports: [PrismaModule,PromotionsModule, ProductsModule, CategoriesModule, VariantsModule, ConfigModule.forRoot({ isGlobal: true }), OrdersModule, BannersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
