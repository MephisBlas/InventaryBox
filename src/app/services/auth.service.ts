import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Router } from '@angular/router';  // Importar Router

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private dbInstance!: SQLiteObject;

  constructor(private sqlite: SQLite, private router: Router) {  // Inyectar Router
    this.createDatabase();
  }

  // Crear la base de datos si no existe
  private async createDatabase() {
    this.dbInstance = await this.sqlite.create({
      name: 'users.db',
      location: 'default',
    });

    await this.dbInstance.executeSql(
      'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username TEXT, email TEXT, password TEXT, is_logged_in INTEGER)',
      []
    );

    await this.checkPreviousSession(); // Verifica si había sesión activa al abrir la app
  }

  // Verificar si había sesión activa cuando la app se reinicia
  private async checkPreviousSession() {
    const sql = 'SELECT * FROM users WHERE is_logged_in = 1 LIMIT 1';
    const res = await this.dbInstance.executeSql(sql, []);
    if (res.rows.length > 0) {
      const user = res.rows.item(0);
      localStorage.setItem('loggedInUser', JSON.stringify(user)); // Guardamos al usuario en localStorage para mantener la sesión
    }
  }

  // Método para verificar si el usuario está autenticado
  async isAuthenticated(): Promise<boolean> {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    
    // Si no hay usuario en localStorage, revisamos la base de datos
    if (!user) {
      const sql = 'SELECT * FROM users WHERE is_logged_in = 1 LIMIT 1';
      const res = await this.dbInstance.executeSql(sql, []);
      if (res.rows.length > 0) {
        localStorage.setItem('loggedInUser', JSON.stringify(res.rows.item(0))); // Restaura la sesión si se encuentra un usuario activo
        return true;
      }
      return false; // No hay usuario autenticado
    }
    return true; // Si ya hay un usuario autenticado en localStorage
  }

  // Método para iniciar sesión
  async login(user: any) {
    const sql = 'UPDATE users SET is_logged_in = 1 WHERE id = ?';
    await this.dbInstance.executeSql(sql, [user.id]);
    
    // Guarda el usuario en localStorage
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }

  // Método para cerrar sesión
  async logout() {
    const user = this.getUser();
    if (user) {
      // Marca al usuario como no autenticado en la base de datos
      const sql = 'UPDATE users SET is_logged_in = 0 WHERE id = ?';
      await this.dbInstance.executeSql(sql, [user.id]);
    }
  
    // Limpia los datos del usuario en localStorage
    localStorage.removeItem('loggedInUser');
  
    // Redirige a la página de login
    this.router.navigate(['/login']);
  }

  // Método para obtener el usuario autenticado
  getUser() {
    return JSON.parse(localStorage.getItem('loggedInUser') || 'null'); // Devuelve el usuario si está autenticado o null si no existe
  }

  // Método para obtener el usuario actual (con id)
  getCurrentUser() {
    const user = this.getUser();
    return user ? { id: user.id, username: user.username } : null; // Retorna el id y el username del usuario
  }

  // Método para obtener todos los usuarios de la base de datos
  async getUsers() {
    const sql = 'SELECT * FROM users';
    const res = await this.dbInstance.executeSql(sql, []);
    const users = [];
    for (let i = 0; i < res.rows.length; i++) {
      users.push(res.rows.item(i));
    }
    return users;
  }

  // Método para actualizar el nombre de usuario
  async updateUsername(userId: number, newUsername: string) {
    const sql = 'UPDATE users SET username = ? WHERE id = ?';
    await this.dbInstance.executeSql(sql, [newUsername, userId]);
  }

  // Método para actualizar la contraseña
  async updatePassword(userId: number, newPassword: string) {
    const sql = 'UPDATE users SET password = ? WHERE id = ?';
    await this.dbInstance.executeSql(sql, [newPassword, userId]);
  }
}
