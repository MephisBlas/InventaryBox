import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  // Definición de la propiedad 'user'
  user = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };

  constructor(private router: Router, private alertController: AlertController) {}

  ngOnInit() {
    // Puedes agregar lógica adicional si es necesario
  }

  // Método para cambiar la contraseña
  changePassword() {
    // Lógica para cambiar la contraseña
    console.log('Change Password method called');
  }

  // Navegar a la página de cambio de nombre
  navigateToChangeName() {
    this.router.navigate(['/cambionombre']);
  }

  // Navegar a la página de cambio de contraseña
  navigateToChangePassword() {
    this.router.navigate(['/cambiopass']);
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
