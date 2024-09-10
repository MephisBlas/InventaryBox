import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  constructor(private router: Router, private alertController: AlertController) {}

  ngOnInit() {
    // Puedes agregar lógica adicional si es necesario
  }

  // Navegar a la página de cambio de nombre
  navigateToChangeName() {
    this.router.navigate(['/cambionombre']); // Asegúrate de que esta ruta esté configurada en tu módulo de enrutamiento
  }

  // Navegar a la página de cambio de contraseña
  navigateToChangePassword() {
    this.router.navigate(['/cambiopass']); // Asegúrate de que esta ruta esté configurada en tu módulo de enrutamiento
  }
  
  // Función para mostrar alertas (si es necesario)
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
