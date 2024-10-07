import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    // Devuelve true si hay un usuario en localStorage
    return !!localStorage.getItem('loggedInUser'); // Cambia 'user' a 'loggedInUser' para consistencia
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
}
