import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { Product } from '../models/product.models';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service'; // Importa el servicio de autenticación
import { EmailComposer } from '@ionic-native/email-composer/ngx'; // Asegúrate de importar EmailComposer

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



  private async createTables(): Promise<void> {
    if (!this.dbInstance) return;

    try {
      await this.dbInstance.executeSql(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          email TEXT,
          password TEXT
        )`, []);

      await this.dbInstance.executeSql(`
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY,
          theme TEXT
        )`, []);

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

      // Crear la tabla de ventas
      await this.dbInstance.executeSql(`
        CREATE TABLE IF NOT EXISTS ventas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
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

  async loadProducts(): Promise<void> {
    const products = await this.getProducts(); // Obtiene la lista de productos
    this.productsSubject.next(products); // Emite la nueva lista de productos
  }

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

  async saveTheme(theme: string): Promise<void> {
    if (!this.dbInstance) return;
    const sql = 'INSERT OR REPLACE INTO settings (id, theme) VALUES (1, ?)';
    try {
      await this.dbInstance.executeSql(sql, [theme]);
    } catch (error) {
      console.error('Error al guardar el tema:', error);
    }
  }

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

  async sellProduct(productId: number, quantity: number): Promise<void> {
    if (!this.dbInstance) return;

    const sqlGetProduct = 'SELECT * FROM products WHERE id = ?';
    try {
      // Obtener el producto desde la base de datos
      const res = await this.dbInstance.executeSql(sqlGetProduct, [productId]);
      if (res.rows.length > 0) {
        const product = res.rows.item(0) as Product;

        // Verificar si hay suficiente cantidad para la venta
        if (product.cantidad >= quantity) {
          const newQuantity = product.cantidad - quantity;
          const newSales = (product.ventas || 0) + quantity;
          const saleDate = new Date().toISOString();  // Fecha actual en formato ISO

          // Actualizar la cantidad y las ventas
          const sqlUpdate = `UPDATE products 
                             SET cantidad = ?, ventas = ? 
                             WHERE id = ?`;
          await this.dbInstance.executeSql(sqlUpdate, [newQuantity, newSales, productId]);

          // Registrar la venta en la tabla de ventas
          const sqlInsertSale = `INSERT INTO ventas (productoId, cantidad, fecha) 
                                 VALUES (?, ?, ?)`;
          await this.dbInstance.executeSql(sqlInsertSale, [productId, quantity, saleDate]);

          console.log(`Venta registrada para el producto ${product.nombre}, cantidad vendida: ${quantity}`);

          // Actualizar la lista de productos
          this.loadProducts();  // Llamar a loadProducts para emitir la lista actualizada
        } else {
          console.log('No hay suficiente stock para realizar la venta');
        }
      }
    } catch (error) {
      console.error('Error al registrar la venta:', error);
    }
  }


  // Obtener ventas por un rango de fechas
  async getSalesByDateRange(startDate: string, endDate: string): Promise<any[]> {
    if (!this.dbInstance) return [];

    const sql = `SELECT productoId, SUM(cantidad) AS totalVentas 
               FROM ventas 
               WHERE fecha BETWEEN ? AND ? 
               GROUP BY productoId`;
    try {
      const res = await this.dbInstance.executeSql(sql, [startDate, endDate]);
      const sales: any[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        sales.push(res.rows.item(i));
      }
      return sales;
    } catch (error) {
      console.error('Error al obtener las ventas:', error);
      return [];
    }
  }

  getDateRange(filter: 'daily' | 'weekly' | 'monthly' | 'yearly') {
    const today = new Date();
    let startDate = new Date(today);
    let endDate = new Date(today);

    switch (filter) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0); // Inicio del día
        endDate.setHours(23, 59, 59, 999); // Fin del día
        break;
      case 'weekly':
        const dayOfWeek = today.getDay();
        startDate.setDate(today.getDate() - dayOfWeek); // Inicio de la semana (domingo)
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(today.getDate() + (6 - dayOfWeek)); // Fin de la semana (sábado)
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        startDate.setDate(1); // Primer día del mes
        startDate.setHours(0, 0, 0, 0);
        endDate.setMonth(today.getMonth() + 1);
        endDate.setDate(0); // Último día del mes
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'yearly':
        startDate.setMonth(0, 1); // Primer día del año
        startDate.setHours(0, 0, 0, 0);
        endDate.setMonth(11, 31); // Último día del año
        endDate.setHours(23, 59, 59, 999);
        break;
    }

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  }

  // Obtener ventas por usuario y rango de fechas
  async getSalesByUserAndDateRange(userId: string, startDate: string, endDate: string): Promise<any[]> {
    if (!this.dbInstance) return [];

    const sql = `SELECT productoId, SUM(cantidad) AS totalVentas 
               FROM ventas 
               WHERE userId = ? AND fecha BETWEEN ? AND ? 
               GROUP BY productoId`;
    try {
      const res = await this.dbInstance.executeSql(sql, [userId, startDate, endDate]);
      const sales: any[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        sales.push(res.rows.item(i));
      }
      return sales;
    } catch (error) {
      console.error('Error al obtener las ventas por usuario:', error);
      return [];
    }
  }


  async updateProduct(productId: number, updatedProduct: Product): Promise<boolean> {
    if (!this.dbInstance) return false; // Verifica si la base de datos está lista
    const sql = `UPDATE products SET 
                  nombre = ?, 
                  clase = ?, 
                  marca = ?, 
                  precioCompra = ?, 
                  precioVenta = ?, 
                  cantidad = ?, 
                  imagen = ? 
                  WHERE id = ?`;

    try {
      await this.dbInstance.executeSql(sql, [
        updatedProduct.nombre,
        updatedProduct.clase,
        updatedProduct.marca,
        updatedProduct.precioCompra,
        updatedProduct.precioVenta,
        updatedProduct.cantidad,
        updatedProduct.imagen,
        productId,
      ]);
      console.log('Producto actualizado con éxito');
      this.loadProducts(); // Actualiza la lista de productos
      return true; // Indica que la actualización fue exitosa
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      return false; // Indica que la actualización falló
    }
  }
}
