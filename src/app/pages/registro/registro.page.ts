import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import emailjs from 'emailjs-com'; // Importamos EmailJS

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
    confirmPassword: '',
  };

  private readonly serviceId = 'service_ckewa4k'; // Reemplaza con tu Service ID de EmailJS
  private readonly templateId = 'template_i3nazo4'; // Reemplaza con tu Template ID de EmailJS
  private readonly userId = 'A8WnrlPuLYRSH7Oee'; // Reemplaza con tu User ID de EmailJS

  constructor(
    private router: Router,
    private alertController: AlertController,
    private userService: UserService
  ) {}

  async registerUser() {
    // Validar que todos los campos estén completos
    if (!this.user.username || !this.user.email || !this.user.password || !this.user.confirmPassword) {
      await this.showAlert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    // Validar que las contraseñas coincidan
    if (this.user.password !== this.user.confirmPassword) {
      await this.showAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    try {
      // Verificar si el usuario ya existe
      const users = await this.userService.getUsers();
      if (users && Array.isArray(users)) {
        const userExists = users.some(
          (u) => u.username === this.user.username || u.email === this.user.email
        );
        if (userExists) {
       
          return;
        }
      }

      // Registrar al usuario
      await this.userService.registerUser(this.user.username, this.user.email, this.user.password);

      // Enviar correo de confirmación
      await this.sendConfirmationEmail();

      // Limpiar el formulario
      this.user = { username: '', email: '', password: '', confirmPassword: '' };
      await this.showAlert('Éxito', 'Registro exitoso. Se ha enviado un correo de confirmación.');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error durante el registro:', error);
      await this.showAlert('Error', 'Hubo un error al registrar el usuario.');
    }
  }

  // Función para enviar el correo usando EmailJS
  async sendConfirmationEmail() {
    const templateParams = {
      username: this.user.username,
      email: this.user.email,
      message: `¡Hola ${this.user.username}! Gracias por registrarte en InventaryBox. Tu registro se ha completado con éxito.`,
    };

    try {
      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams,
        this.userId
      );
      if (response.status === 200) {
        console.log('Correo de confirmación enviado:', response);
      } else {
        console.error('Error al enviar el correo:', response);
        await this.showAlert('Error', 'No se ha enviado el correo de confirmación.');
      }
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      await this.showAlert('Error', 'No se ha enviado el correo de confirmación.');
    }
  }

  // Función para mostrar alertas
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
