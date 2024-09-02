import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  user = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private router: Router) {}

  // Función para manejar el registro de usuario
  registerUser() {
    if (this.passwordsMatch()) {
      // Obtener los usuarios existentes del almacenamiento local
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

      // Agregar el nuevo usuario a la lista
      storedUsers.push({
        username: this.user.username,
        email: this.user.email,
        password: this.user.password
      });

      // Guardar la lista actualizada en el almacenamiento local
      localStorage.setItem('users', JSON.stringify(storedUsers));

      console.log('Usuario registrado:', this.user);

      // Redirigir al usuario a la página de inicio de sesión
      this.router.navigate(['/home']);
    } else {
      console.log('Las contraseñas no coinciden.');
    }
  }

  // Función para verificar si las contraseñas coinciden
  passwordsMatch(): boolean {
    return this.user.password === this.user.confirmPassword;
  }
}
