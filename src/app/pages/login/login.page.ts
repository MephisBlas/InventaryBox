import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service'; // Asegúrate de importar el AuthService

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user = {
    username: '',
    password: ''
  };

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Cualquier inicialización adicional si es necesaria
  }

  async login() {
    // Validar que los campos no estén vacíos
    if (!this.user.username || !this.user.password) {
      await this.showAlert('Error', 'Por favor, ingrese el nombre de usuario y la contraseña.');
      return;
    }

    // Recuperar usuarios almacenados en localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

    // Verificar si hay usuarios almacenados
    if (!storedUsers || storedUsers.length === 0) {
      await this.showAlert('Error', 'No hay usuarios registrados. Por favor, regístrate primero.');
      return;
    }

    // Verificar si el usuario existe en la lista y si la contraseña es correcta
    const foundUser = storedUsers.find((u: any) => u.username === this.user.username && u.password === this.user.password);

    if (foundUser) {
      // Guardar información del usuario en localStorage para mantener la sesión
      this.authService.login(foundUser); // Usa el AuthService para iniciar sesión
      
      // Inicio de sesión exitoso
      await this.showAlert('Éxito', `Inicio de sesión exitoso. Bienvenido, ${foundUser.username}`);
      this.router.navigate(['/home']);
    } else {
      // Usuario o contraseña incorrectos
      await this.showAlert('Error', 'Usuario o contraseña incorrectos');
    }
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

  navigateToRegister() {
    this.router.navigate(['/registro']); // Redirige a la página de registro
  }
}
