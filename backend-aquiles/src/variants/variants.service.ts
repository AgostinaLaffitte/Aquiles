import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVariantDto } from './dto/create-variant.dto'; 
@Injectable()
export class VariantsService {
  constructor(private prisma: PrismaService) {}

  create(createVariantDto: CreateVariantDto) {
    return this.prisma.productVariant.create({
      data: {
        name: createVariantDto.name,
        stock: createVariantDto.stock,
        price: createVariantDto.price,
        product: {
          connect: { id: createVariantDto.productId }
        }
      },
    });
  }

  findAll() {
    return this.prisma.productVariant.findMany({
      include: {
        product: true
      }
    });
  }
  async findOne(id: number) {
    return this.prisma.productVariant.findUnique({ where: { id } });
  }

  async update(id: number, data: any) {
    return this.prisma.productVariant.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.productVariant.delete({ where: { id } });
  }
}