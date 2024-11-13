export interface Product {
  id: number;
  nombre: string;
  clase: string;
  marca: string;
  precioCompra: number;
  precioVenta: number;
  cantidad: number;
  ventas?: number; 
  imagen?: string; 
}
