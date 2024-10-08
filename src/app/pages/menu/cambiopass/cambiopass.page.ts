import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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

  constructor(private router: Router, private alertController: AlertController) {}

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

    // Recuperar usuarios almacenados en localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

    // Buscar el usuario autenticado en localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || 'null');

    if (!loggedInUser) {
      await this.showAlert('Error', 'No se encontró el usuario autenticado.');
      return;
    }

    // Buscar el usuario con la contraseña actual
    const userIndex = storedUsers.findIndex((u: any) => u.username === loggedInUser.username && u.password === this.user.currentPassword);

    if (userIndex === -1) {
      await this.showAlert('Error', 'Contraseña actual incorrecta.');
      return;
    }

    // Actualizar la contraseña
    storedUsers[userIndex].password = this.user.newPassword;

    // Guardar la lista actualizada en localStorage
    localStorage.setItem('users', JSON.stringify(storedUsers));

    // Limpiar campos
    this.user = { currentPassword: '', newPassword: '', confirmNewPassword: '' };

    // Mostrar mensaje de éxito
    await this.showAlert('Éxito', 'Contraseña cambiada exitosamente.');

    // Redirigir a la página de inicio de sesión
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
