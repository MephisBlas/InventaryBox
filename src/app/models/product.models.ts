export interface Product {
  id: number;
  nombre: string;
  clase: string;
  marca: string;
  precioCompra: number;
  precioVenta: number;
  cantidad: number;
  ventas?: number; // Añade esta propiedad
  imagen?: string; // Si la tienes
}
