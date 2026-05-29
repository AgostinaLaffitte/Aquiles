export interface ProductVariant {
  id: number;
  name: string;
  stock: number;
  price?: number; // Opcional, por si la variante tiene precio distinto
  productId: number;
}