import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

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
  showPassword = false; // Para mostrar/ocultar contraseña

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private userService: UserService // Inyección del servicio de usuarios
  ) {}

  ngOnInit() {
    // Verifica si ya está autenticado
    this.authService.isAuthenticated().then((authenticated) => {
      if (authenticated) {
        this.router.navigate(['/home']); // Si ya está autenticado, lo redirige a la página principal
      }
    });
  }

  async login() {
    if (!this.user.username || !this.user.password) {
      await this.showAlert('Error', 'Por favor, ingrese el nombre de usuario y la contraseña.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();

    try {
      const storedUsers = await this.authService.getUsers(); // Obtener usuarios de AuthService
      if (!storedUsers || storedUsers.length === 0) {
        await this.showAlert('Error', 'No hay usuarios registrados. Por favor, regístrate primero.');
        return;
      }

      const foundUser = storedUsers.find((u: any) =>
        u.username === this.user.username && u.password === this.user.password
      );

      if (foundUser) {
        await this.authService.login(foundUser); // Iniciar sesión con AuthService
        await this.userService.loadProducts(); // Cargar productos del usuario autenticado

        await this.showAlert('Éxito', `Inicio de sesión exitoso. Bienvenido, ${foundUser.username}`);
        this.router.navigate(['/home']);
      } else {
        await this.showAlert('Error', 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      await this.showAlert('Error', 'Ocurrió un error al intentar iniciar sesión. Por favor, inténtelo de nuevo más tarde.');
    } finally {
      loading.dismiss();
    }
  }

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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Función para alternar la visibilidad de la contraseña
  }
}
