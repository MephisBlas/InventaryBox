import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service'; // Asegúrate de importar tu AuthService

@Component({
  selector: 'app-cambionombre',
  templateUrl: './cambionombre.page.html',
  styleUrls: ['./cambionombre.page.scss'],
})
export class CambionombrePage implements OnInit {
  user = {
    currentPassword: '',
    newUsername: ''
  };

  constructor(
    private router: Router, 
    private alertController: AlertController,
    private authService: AuthService // Inyecta AuthService
  ) {}

  ngOnInit() {
    // Inicialización si es necesaria
  }

  async changeName() {
    // Validar campos
    if (!this.user.currentPassword || !this.user.newUsername) {
      await this.showAlert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    // Recuperar usuarios almacenados en SQLite
    const storedUsers = await this.authService.getUsers();
    console.log('Usuarios almacenados:', storedUsers);

    // Buscar el usuario con la contraseña actual
    const foundUser = storedUsers.find((u: any) => u.password === this.user.currentPassword);
    console.log('Usuario encontrado:', foundUser);

    if (!foundUser) {
      await this.showAlert('Error', 'Contraseña actual incorrecta.');
      return;
    }

    // Verificar si el nuevo nombre de usuario ya está en uso
    const usernameExists = storedUsers.some((u: any) => u.username === this.user.newUsername);
    console.log('Nombre de usuario ya existe:', usernameExists);

    if (usernameExists) {
      await this.showAlert('Error', 'El nuevo nombre de usuario ya está en uso.');
      return;
    }

    // Actualizar el nombre de usuario en SQLite
    await this.authService.updateUsername(foundUser.id, this.user.newUsername);

    // Limpiar campos
    this.user = { currentPassword: '', newUsername: '' };

    // Mostrar mensaje de éxito
    await this.showAlert('Éxito', 'Nombre de usuario cambiado exitosamente.');

    // Redirigir al inicio de sesión para que el usuario inicie sesión con el nuevo nombre
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
