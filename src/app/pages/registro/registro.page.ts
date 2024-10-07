import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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

  constructor(private router: Router, private alertController: AlertController) {}

  async registerUser() {
    if (!this.user.username || !this.user.email || !this.user.password || !this.user.confirmPassword) {
      await this.showAlert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    if (this.user.password !== this.user.confirmPassword) {
      await this.showAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    // Obtener los usuarios existentes del almacenamiento local
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

    // Verificar si el usuario o el correo electrónico ya están en uso
    const userExists = storedUsers.some((u: any) => u.username === this.user.username || u.email === this.user.email);

    if (userExists) {
      await this.showAlert('Error', 'El nombre de usuario o el correo electrónico ya están en uso.');
      return;
    }

    // Agregar el nuevo usuario a la lista
    storedUsers.push({
      username: this.user.username,
      email: this.user.email,
      password: this.user.password
    });

    // Guardar la lista actualizada en el almacenamiento local
    localStorage.setItem('users', JSON.stringify(storedUsers));

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
