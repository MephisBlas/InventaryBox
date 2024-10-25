
export interface Product {
  id?: number; // ID único del producto (opcional para que no sea necesario al crear uno nuevo)
  nombre: string; // Nombre del producto
  clase: string; // Clase o categoría del producto
  marca: string; // Marca del producto
  precioCompra: number; // Precio al que se compró el producto
  precioVenta: number; // Precio al que se venderá el producto
  cantidad: number; // Cantidad disponible en stock
  imagen?: string; // Ruta de la imagen (opcional)
  userId: string; // ID del usuario que creó el producto
}
