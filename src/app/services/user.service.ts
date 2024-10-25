import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular'; // Importar Platform para asegurarse de que SQLite solo se inicializa en el dispositivo
import { Product } from '../models/product.models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private dbInstance: SQLiteObject | null = null;

  constructor(private sqlite: SQLite, private platform: Platform) {
    // Asegurarse de que la base de datos solo se inicialice cuando la plataforma esté lista
    this.platform.ready().then(() => {
      this.createDatabase();
    });
  }

  // Método para crear la base de datos
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

  // Método para crear las tablas necesarias
  private async createTables(): Promise<void> {
    if (!this.dbInstance) return;

    try {
      await this.dbInstance.executeSql(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          email TEXT,
          password TEXT)`, []);
      
      await this.dbInstance.executeSql(`
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY,
          theme TEXT)`, []);
      
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
          userId TEXT)`, []);
      
      console.log('Tablas creadas con éxito');
    } catch (error) {
      console.error('Error al crear las tablas:', error);
    }
  }

  // Método para registrar un usuario
  async registerUser(username: string, email: string, password: string): Promise<void> {
    if (!this.dbInstance) return;
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    try {
      await this.dbInstance.executeSql(sql, [username, email, password]);
      console.log('Usuario registrado con éxito');
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
    }
  }

  // Método para obtener todos los usuarios
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

  // Método para registrar un producto
  async registerProduct(product: Product): Promise<void> {
    if (!this.dbInstance) return;
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
        product.userId,
      ]);
      console.log('Producto registrado con éxito');
    } catch (error) {
      console.error('Error al registrar el producto:', error);
    }
  }

  // Método para obtener todos los productos
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

  // Método para obtener productos por usuario
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

  // Método para actualizar la contraseña de un usuario
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

  // Métodos para manejar el tema de configuración
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
  // Método para eliminar un producto
  async deleteProduct(productId: number): Promise<void> {
    if (!this.dbInstance) return;
    const sql = 'DELETE FROM products WHERE id = ?';
    try {
      await this.dbInstance.executeSql(sql, [productId]);
      console.log('Producto eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  }

  
}
