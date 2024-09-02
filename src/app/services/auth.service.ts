import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('user'); // Limpiar los datos del usuario del almacenamiento local
    // Puedes agregar más lógica de cierre de sesión aquí, como invalidar tokens
  }
}
