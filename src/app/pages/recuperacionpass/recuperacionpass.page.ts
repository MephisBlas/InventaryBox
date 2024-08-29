import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperacionpass',
  templateUrl: './recuperacionpass.page.html',
  styleUrls: ['./recuperacionpass.page.scss'],
})
export class RecuperacionpassPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // Lógica al inicializar el componente
  }

  // Método para volver a la página anterior
  goBack() {
    this.router.navigate(['/login']); // Cambia la ruta según tu configuración de enrutamiento
  }

  // Método para manejar la recuperación de contraseña
  recoverPassword() {
    // Lógica para la recuperación de contraseña
    console.log('Recuperar contraseña clickeado');
    // Aquí podrías hacer una llamada a un servicio de recuperación de contraseña
  }
}
