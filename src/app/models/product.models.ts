

export interface Product {
    nombre: string;
    clase: string;
    marca: string;
    precioCompra: number;
    precioVenta: number;
    cantidad: number;
    imagen?: string; // Opcional, si no siempre se proporciona
    userId: string; // El ID del usuario que creó el producto
  }
  