import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service'; // Asegúrate de que la ruta sea correcta

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

  constructor(
    private router: Router,
    private alertController: AlertController,
    private userService: UserService // Inyectar el servicio
  ) {}

  async registerUser() {
    if (!this.user.username || !this.user.email || !this.user.password || !this.user.confirmPassword) {
      await this.showAlert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    if (this.user.password !== this.user.confirmPassword) {
      await this.showAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    // Verificar si el usuario o el correo electrónico ya están en uso
    const users = await this.userService.getUsers();
    const userExists = users.some(u => u.username === this.user.username || u.email === this.user.email);

    if (userExists) {
      await this.showAlert('Error', 'El nombre de usuario o el correo electrónico ya están en uso.');
      return;
    }

    // Agregar el nuevo usuario a la base de datos
    await this.userService.registerUser(this.user.username, this.user.email, this.user.password);

    // Limpiar los campos del formulario
    this.user = { username: '', email: '', password: '', confirmPassword: '' };

    // Mostrar mensaje de éxito y redirigir al inicio de sesión
    await this.showAlert('Éxito', 'Registro exitoso');
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
