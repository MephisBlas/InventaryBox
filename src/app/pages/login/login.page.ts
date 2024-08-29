import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // Lógica al inicializar el componente
  }

  login() {
    // Agregar la lógica para iniciar sesión
    console.log('Iniciar sesión clickeado');
    // Validaciones o llamar a un servicio de autenticación
  }

  navigateToRegister() {
    this.router.navigate(['/registro']); // Asegúrate de que esta ruta esté definida en tu enrutador
  }
}
