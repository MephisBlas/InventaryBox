import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { HttpClient } from '@angular/common/http';

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
    private userService: UserService,
    private http: HttpClient
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

    const users = await this.userService.getUsers();
    const userExists = users.some(u => u.username === this.user.username || u.email === this.user.email);

    if (userExists) {
      await this.showAlert('Error', 'El nombre de usuario o el correo electrónico ya están en uso.');
      return;
    }

    await this.userService.registerUser(this.user.username, this.user.email, this.user.password);

    // Enviar correo electrónico de confirmación
    await this.sendConfirmationEmail(this.user.email);

    this.user = { username: '', email: '', password: '', confirmPassword: '' };
    await this.showAlert('Éxito', 'Registro exitoso');
    this.router.navigate(['/login']);
  }

  async sendConfirmationEmail(email: string) {
    const emailContent = {
      to: email,
      subject: 'Registro Exitoso en InventaryBox',
      text: '¡Hola! Gracias por registrarte en InventaryBox. Tu registro se ha completado con éxito.'
    };

    try {
      const response = await this.http.post('http://localhost:3000/send-email', emailContent).toPromise();
      console.log('Correo de confirmación enviado:', response);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      await this.showAlert('Error', 'No se pudo enviar el correo de confirmación.');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
