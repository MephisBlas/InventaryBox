import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private dbInstance!: SQLiteObject;

  constructor(private sqlite: SQLite) {
    this.createDatabase();
  }

  private async createDatabase() {
    this.dbInstance = await this.sqlite.create({
      name: 'users.db',
      location: 'default'
    });
    await this.dbInstance.executeSql('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username TEXT, email TEXT, password TEXT)', []);
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('loggedInUser'); // Devuelve true si hay un usuario en localStorage
  }

  // Método para iniciar sesión
  login(user: any) {
    localStorage.setItem('loggedInUser', JSON.stringify(user)); // Guarda el usuario en localStorage
  }

  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('loggedInUser'); // Limpia los datos del usuario del almacenamiento local
  }

  // Método para obtener el usuario autenticado
  getUser() {
    return JSON.parse(localStorage.getItem('loggedInUser') || 'null'); // Devuelve el usuario autenticado o null si no existe
  }

  // Método para obtener usuarios de la base de datos
  async getUsers() {
    const sql = 'SELECT * FROM users';
    const res = await this.dbInstance.executeSql(sql, []);
    const users = [];
    for (let i = 0; i < res.rows.length; i++) {
      users.push(res.rows.item(i));
    }
    return users;
  }
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
