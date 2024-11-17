export interface Venta {
    id: number;              // ID de la venta
    productoId: number;      // ID del producto vendido
    cantidad: number;        // Cantidad vendida
    precioVenta: number;     // Precio al que se vendió el producto
    fechaVenta: Date;        // Fecha de la venta
    nombreProducto: string;  // Nombre del producto vendido
  }
  