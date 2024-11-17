import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { Product } from '../models/product.models';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service'; // Importa el servicio de autenticación
import { EmailComposer } from '@ionic-native/email-composer/ngx'; // Asegúrate de importar EmailComposer
import { Venta } from '../models/ventas.models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private dbInstance: SQLiteObject | null = null;
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(
    private sqlite: SQLite,
    private platform: Platform,
    private authService: AuthService,
    private emailComposer: EmailComposer // Inyecta EmailComposer
  ) {
    this.platform.ready().then(() => {
      this.createDatabase();
    });
  }

  // Crear la base de datos y las tablas
  private async createDatabase(): Promise<void> {
    try {
      this.dbInstance = await this.sqlite.create({
        name: 'users.db',
        location: 'default',
      });
      console.log('Base de datos creada con éxito');
      await this.createTables();
    } catch (error) {
      console.error('Error al crear la base de datos:', error);
    }
  }

  // Crear las tablas necesarias (usuarios, productos, configuraciones, ventas)
  private async createTables(): Promise<void> {
    if (!this.dbInstance) return;

    try {
      // Tabla de usuarios
      await this.dbInstance.executeSql(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          email TEXT,
          password TEXT
        )`, []);

      // Tabla de configuraciones (tema)
      await this.dbInstance.executeSql(`
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY,
          theme TEXT
        )`, []);

      // Tabla de productos
      await this.dbInstance.executeSql(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT,
          clase TEXT,
          marca TEXT,
          precioCompra REAL,
          precioVenta REAL,
          cantidad INTEGER,
          imagen TEXT,
          userId TEXT
        )`, []);

      // Tabla de ventas
      await this.dbInstance.executeSql(`
        CREATE TABLE IF NOT EXISTS ventas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombreProducto TEXT,  
          productoId INTEGER,
          cantidad INTEGER,
          fecha TEXT,
          FOREIGN KEY (productoId) REFERENCES products(id)
        )`, []);

      console.log('Tablas creadas con éxito');
    } catch (error) {
      console.error('Error al crear las tablas:', error);
    }
  }

  // Registrar un nuevo usuario
  async registerUser(username: string, email: string, password: string): Promise<void> {
    if (!this.dbInstance) return;
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    try {
      await this.dbInstance.executeSql(sql, [username, email, password]);
      console.log('Usuario registrado con éxito');
      this.sendConfirmationEmail(email); // Enviar correo de confirmación
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
    }
  }

  // Enviar un correo de confirmación
  private sendConfirmationEmail(email: string) {
    let emailData = {
      to: email,
      subject: 'Registro Exitoso',
      body: 'Gracias por registrarte. Tu cuenta ha sido creada exitosamente.',
      isHtml: true
    };

    this.emailComposer.open(emailData).then(() => {
      console.log('Correo de confirmación enviado');
    }).catch(error => {
      console.error('Error al enviar correo de confirmación:', error);
    });
  }

  // Recuperar la contraseña (enviar correo)
  async recoverPassword(email: string): Promise<void> {
    let emailData = {
      to: email,
      subject: 'Recuperación de Contraseña',
      body: 'Haz clic en el siguiente enlace para recuperar tu contraseña: [enlace aquí]',
      isHtml: true
    };

    this.emailComposer.open(emailData).then(() => {
      console.log('Correo de recuperación enviado');
    }).catch(error => {
      console.error('Error al enviar correo de recuperación:', error);
    });
  }

  // Obtener todos los usuarios
  async getUsers(): Promise<any[]> {
    if (!this.dbInstance) return [];
    const sql = 'SELECT * FROM users';
    try {
      const res = await this.dbInstance.executeSql(sql, []);
      const users: any[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        users.push(res.rows.item(i));
      }
      return users;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return [];
    }
  }

  // Registrar un producto
  async registerProduct(product: Product): Promise<void> {
    if (!this.dbInstance) return;
    const userId = this.authService.getCurrentUser()?.id; // Obtén el ID del usuario actual

    if (!userId) {
      console.error('No hay un usuario autenticado.');
      return;
    }

    const sql = `INSERT INTO products (nombre, clase, marca, precioCompra, precioVenta, cantidad, imagen, userId) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    try {
      await this.dbInstance.executeSql(sql, [
        product.nombre,
        product.clase,
        product.marca,
        product.precioCompra,
        product.precioVenta,
        product.cantidad,
        product.imagen,
        userId, // Usa el ID del usuario actual
      ]);
      console.log('Producto registrado con éxito');
      this.loadProducts(); // Actualiza la lista de productos
    } catch (error) {
      console.error('Error al registrar el producto:', error);
    }
  }

  // Cargar los productos
  async loadProducts(): Promise<void> {
    const products = await this.getProducts(); // Obtiene la lista de productos
    this.productsSubject.next(products); // Emite la nueva lista de productos
  }

  // Obtener todos los productos
  async getProducts(): Promise<Product[]> {
    if (!this.dbInstance) return [];
    const sql = 'SELECT * FROM products';
    try {
      const res = await this.dbInstance.executeSql(sql, []);
      const products: Product[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        products.push(res.rows.item(i));
      }
      return products;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return [];
    }
  }

  // Obtener productos por usuario
  async getProductsByUser(userId: string): Promise<Product[]> {
    if (!this.dbInstance) return [];
    const sql = 'SELECT * FROM products WHERE userId = ?';
    try {
      const res = await this.dbInstance.executeSql(sql, [userId]);
      const products: Product[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        products.push(res.rows.item(i));
      }
      return products;
    } catch (error) {
      console.error('Error al obtener productos por usuario:', error);
      return [];
    }
  }

  // Actualizar contraseña del usuario
  async updateUserPassword(username: string, currentPassword: string, newPassword: string): Promise<boolean> {
    if (!this.dbInstance) return false;
    const sql = 'UPDATE users SET password = ? WHERE username = ? AND password = ?';
    try {
      const result = await this.dbInstance.executeSql(sql, [newPassword, username, currentPassword]);
      return result.rowsAffected > 0; // Retorna true si se actualizó
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      return false;
    }
  }

  // Guardar tema de la aplicación
  async saveTheme(theme: string): Promise<void> {
    if (!this.dbInstance) return;
    const sql = 'INSERT OR REPLACE INTO settings (id, theme) VALUES (1, ?)';
    try {
      await this.dbInstance.executeSql(sql, [theme]);
    } catch (error) {
      console.error('Error al guardar el tema:', error);
    }
  }

  // Cargar tema de la aplicación
  async loadTheme(): Promise<string | null> {
    if (!this.dbInstance) return null;
    const sql = 'SELECT theme FROM settings WHERE id = 1';
    try {
      const res = await this.dbInstance.executeSql(sql, []);
      return res.rows.length > 0 ? res.rows.item(0).theme : null;
    } catch (error) {
      console.error('Error al cargar el tema:', error);
      return null;
    }
  }

  // Eliminar un producto
  async deleteProduct(productId: number): Promise<void> {
    if (!this.dbInstance) return;
    const sql = 'DELETE FROM products WHERE id = ?';
    try {
      await this.dbInstance.executeSql(sql, [productId]);
      console.log('Producto eliminado con éxito');
      this.loadProducts(); // Actualiza la lista de productos
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  }

  // Obtener producto por ID
  async getProductById(productId: number): Promise<Product | undefined> {
    if (!this.dbInstance) return undefined;
    const sql = 'SELECT * FROM products WHERE id = ?';
    try {
      const res = await this.dbInstance.executeSql(sql, [productId]);
      return res.rows.length > 0 ? res.rows.item(0) as Product : undefined; // Asegúrate de que el tipo sea Product
    } catch (error) {
      console.error('Error al obtener el producto:', error);
      return undefined;
    }
  }

  // Método para actualizar un producto en UserService
  async updateProduct(productId: number, updatedProduct: Product): Promise<void> {
    if (!this.dbInstance) return;

    const sql = `UPDATE products SET nombre = ?, clase = ?, marca = ?, precioCompra = ?, 
               precioVenta = ?, cantidad = ?, imagen = ? WHERE id = ?`;
    try {
      // Ejecutar la actualización
      await this.dbInstance.executeSql(sql, [
        updatedProduct.nombre,
        updatedProduct.clase,
        updatedProduct.marca,
        updatedProduct.precioCompra,
        updatedProduct.precioVenta,
        updatedProduct.cantidad,
        updatedProduct.imagen,
        productId
      ]);
      console.log('Producto actualizado con éxito');
      this.loadProducts(); // Actualiza la lista de productos
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
    }
  }

  // Registrar una venta de producto
async sellProduct(productId: number, quantity: number): Promise<void> {
  if (!this.dbInstance) {
    console.error('No hay instancia de base de datos');
    return;
  }

  const sqlGetProduct = 'SELECT * FROM products WHERE id = ?';
  try {
    // Obtener el producto desde la base de datos
    const res = await this.dbInstance.executeSql(sqlGetProduct, [productId]);

    if (res.rows.length > 0) {
      const product = res.rows.item(0) as Product;

      // Verificar si hay suficiente cantidad para la venta
      if (product.cantidad >= quantity) {
        const newQuantity = product.cantidad - quantity;  // Actualizar la cantidad de productos disponibles
        const saleDate = new Date().toISOString();  // Fecha actual en formato ISO

        // Actualizar la cantidad del producto en la tabla de productos
        const sqlUpdateProduct = `
          UPDATE products 
          SET cantidad = ? 
          WHERE id = ?
        `;
        await this.dbInstance.executeSql(sqlUpdateProduct, [newQuantity, productId]);

        // Registrar la venta en la tabla de ventas
        const sqlInsertSale = `
          INSERT INTO ventas (productoId, nombreProducto, cantidad, fecha) 
          VALUES (?, ?, ?, ?)
        `;
        await this.dbInstance.executeSql(sqlInsertSale, [productId, product.nombre, quantity, saleDate]);

        console.log(`Venta registrada para el producto ${product.nombre}, cantidad vendida: ${quantity}`);

        // Actualizar la lista de productos
        this.loadProducts();  // Llamar a loadProducts para emitir la lista actualizada

      } else {
        console.log('No hay suficiente stock para realizar la venta');
      }
    } else {
      console.log('Producto no encontrado');
    }
  } catch (error) {
    console.error('Error al registrar la venta:', error);
  }
}


  // Obtener la cantidad de ventas de un producto específico
  async getSalesByProductId(productId: number): Promise<number> {
    if (!this.dbInstance) return 0;

    const sql = 'SELECT COUNT(*) AS salesCount FROM ventas WHERE productoId = ?';
    try {
      const res = await this.dbInstance.executeSql(sql, [productId]);
      return res.rows.length > 0 ? res.rows.item(0).salesCount : 0;
    } catch (error) {
      console.error('Error al obtener las ventas del producto:', error);
      return 0;
    }
  }

}
