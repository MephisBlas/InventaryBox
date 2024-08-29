import { Component, OnInit } from '@angular/core';

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

  constructor() {}

  // Función para manejar el registro de usuario
  registerUser() {
    if (this.passwordsMatch()) {
      // Aquí puedes manejar el registro de usuario, por ejemplo, enviando los datos a una API
      console.log('Usuario registrado:', this.user);
    } else {
      console.log('Las contraseñas no coinciden.');
    }
  }

  // Función para verificar si las contraseñas coinciden
  passwordsMatch(): boolean {
    return this.user.password === this.user.confirmPassword;
  }
}
