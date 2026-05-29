import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { 
      items, customerName, customerEmail, customerPhone, 
      deliveryMethod, address, city, postalCode, notes 
    } = createOrderDto;

    return this.prisma.$transaction(async (tx) => {
      const activePromos = await tx.promotion.findMany({ where: { active: true } });
      let totalOrder = 0;
      const orderItemsData: { 
        productId: number; 
        variantId: number | null; 
        quantity: number; 
        priceAtPurchase: number 
      }[] = [];

      const quantityByProduct: { [productId: number]: number } = {};

      // Primero calculamos el total de cantidad por producto para las promos
      for (const item of items) {
        const v = await tx.productVariant.findUnique({ where: { id: item.variantId } });
        if (v) {
          quantityByProduct[v.productId] = (quantityByProduct[v.productId] || 0) + item.quantity;
        }
      }

      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: { include: { categories: true } } },
        });

        if (!variant) {
          throw new BadRequestException(`La variante con ID ${item.variantId} no existe.`);
        }

        if (variant.stock < item.quantity) {
          throw new BadRequestException(
            `Stock insuficiente para "${variant.name}". Disponibles: ${variant.stock}, solicitados: ${item.quantity}`,
          );
        }

        // Definimos el precio base original
        const precioBase = variant.price ?? (variant.product.isOffer ? variant.product.offerPrice : variant.product.price) ?? 0;
        let precioFinal = precioBase;

        const totalProductQty = quantityByProduct[variant.productId] || item.quantity;

        const volumePromo = activePromos.find(
          p => p.productId === variant.productId && p.type === 'CANTIDAD' && totalProductQty >= p.minQuantity
        );

        const categoryIds = variant.product.categories.map(c => c.id);
        const percentPromo = activePromos.find(
          p => p.type === 'PORCENTAJE' && (p.productId === variant.productId || categoryIds.includes(p.categoryId ?? -1))
        );

        // Calculamos el precio aplicado a esta variante
        if (volumePromo) {
          precioFinal = volumePromo.discountValue; 
        } else if (percentPromo) {
          precioFinal = precioBase * (1 - (percentPromo.discountValue / 100));
        }

        // Acumulamos al total de la orden
        totalOrder += (precioFinal * item.quantity);

        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });

        orderItemsData.push({
          productId: variant.productId,
          variantId: variant.id,
          quantity: item.quantity,
          priceAtPurchase: Number(precioFinal.toFixed(2)),
        });
      }

      // Descuento total del carrito
      const wholesalePromo = activePromos.find(p => p.type === 'TOTAL_CARRITO' && p.active);
      if (wholesalePromo && totalOrder >= wholesalePromo.minQuantity) {
        totalOrder = totalOrder * (1 - (wholesalePromo.discountValue / 100));
      }

      return tx.order.create({
        data: {
          customerName,
          customerEmail,
          customerPhone,
          deliveryMethod,
          address,
          city,
          postalCode,
          notes,
          paymentMethod: 'TRANSFERENCIA', 
          total: Number(totalOrder.toFixed(2)),
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: { product: true, variant: true },
          },
        },
      });
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: { items: { include: { product: true, variant: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true, variant: true } } },
    });
    if (!order) throw new NotFoundException(`Orden #${id} no encontrada`);
    return order;
  }

 async updateStatus(id: number, status: string) {
  return this.prisma.$transaction(async (tx) => {
    // 1. Buscamos la orden con sus ítems actuales
    const order = await tx.order.findUnique({ 
      where: { id },
      include: { items: true } 
    });

    if (!order) throw new NotFoundException(`Orden #${id} no encontrada`);

    const oldStatus = order.status;

    // 2. Lógica para reponer stock (si cancelamos) o descontar (si activamos)
    if (oldStatus !== 'CANCELADO' && status === 'CANCELADO') {
      // Reponer stock
      for (const item of order.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } }
          });
        }
      }
    } else if (oldStatus === 'CANCELADO' && status !== 'CANCELADO') {
      // Descontar stock (si reactivamos un pedido cancelado)
      for (const item of order.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } }
          });
        }
      }
    }

    // 3.  actualizamos el estado de la orden
    return tx.order.update({
      where: { id },
      data: { status },
    });
  });
}
}