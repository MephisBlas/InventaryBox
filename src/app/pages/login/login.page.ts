import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user = {
    username: '',
    password: ''
  };

  constructor(private router: Router) { }

  ngOnInit() {
    // Cualquier lógica que necesites al inicializar el componente
  }

  login() {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

    // Busca el usuario en el almacenamiento local
    const foundUser = storedUsers.find((user: any) => user.username === this.user.username && user.password === this.user.password);

    if (foundUser) {
      // Si el usuario es encontrado, redirigir a la página de inicio
      console.log('Inicio de sesión exitoso');
      this.router.navigate(['/home']);
    } else {
      // Mostrar un mensaje de error o manejar el error de autenticación
      console.log('Usuario o contraseña incorrectos');
    }
  }

  navigateToRegister() {
    this.router.navigate(['/registro']); // Redirige a la página de registro
  }
}

