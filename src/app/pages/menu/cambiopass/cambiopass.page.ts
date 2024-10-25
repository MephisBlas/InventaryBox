import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service'; // Asegúrate de importar el AuthService

@Component({
  selector: 'app-cambiopass',
  templateUrl: './cambiopass.page.html',
  styleUrls: ['./cambiopass.page.scss'],
})
export class CambiopassPage implements OnInit {
  user = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService // Añadir AuthService
  ) {}

  ngOnInit() {
    // Puedes agregar lógica adicional si es necesario
  }

  async changePassword() {
    // Validar campos
    if (!this.user.currentPassword || !this.user.newPassword || !this.user.confirmNewPassword) {
      await this.showAlert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    if (this.user.newPassword !== this.user.confirmNewPassword) {
      await this.showAlert('Error', 'Las nuevas contraseñas no coinciden.');
      return;
    }

    // Obtener el usuario autenticado
    const loggedInUser = this.authService.getUser();

    if (!loggedInUser) {
      await this.showAlert('Error', 'No se encontró el usuario autenticado.');
      return;
    }

    // Buscar el usuario en la base de datos y verificar la contraseña actual
    const users = await this.authService.getUsers();
    const userIndex = users.findIndex((u: any) => u.username === loggedInUser.username && u.password === this.user.currentPassword);

    if (userIndex === -1) {
      await this.showAlert('Error', 'Contraseña actual incorrecta.');
      return;
    }

    // Actualizar la contraseña en la base de datos
    await this.authService.updatePassword(users[userIndex].id, this.user.newPassword);

    // Limpiar campos
    this.user = { currentPassword: '', newPassword: '', confirmNewPassword: '' };

    // Mostrar mensaje de éxito
    await this.showAlert('Éxito', 'Contraseña cambiada exitosamente.');

    // Opcional: Redirigir a la página de inicio de sesión
    this.router.navigate(['/login']);
  }

  // Función para mostrar alertas
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
