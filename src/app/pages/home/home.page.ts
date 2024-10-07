import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service'; // Verifica que esta ruta sea correcta

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  isDarkMode = false; // Variable para controlar el estado del tema
  username: string = ''; // Agregar propiedad para el nombre de usuario
  products: any[] = []; // Lista de productos

  constructor(
    private menuCtrl: MenuController,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.setInitialTheme(); // Establece el tema inicial basado en las preferencias del sistema o almacenamiento local
    this.loadUser(); // Cargar el nombre del usuario al iniciar
  }

  // Método que se ejecuta cada vez que la vista va a entrar en foco
  ionViewWillEnter() {
    this.loadProducts(); // Cargar productos desde localStorage cada vez que se entra a la página
  }

  // Método para cargar el nombre del usuario desde el almacenamiento local
  private loadUser() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');

    if (loggedInUser && loggedInUser.username) {
      this.username = loggedInUser.username;
    } else {
      this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión si no hay usuario
    }
  }

  // Método para cargar productos desde localStorage
  private loadProducts() {
    this.products = JSON.parse(localStorage.getItem('products') || '[]');
  }

  // Método para navegar a la página de registro de productos
  navigateToRegistroProducto() {
    this.router.navigate(['/registroproducto']);
  }

  // Método para cambiar el tema
  toggleTheme(event: CustomEvent) {
    this.isDarkMode = event.detail.checked; // Actualiza el estado del tema
    this.applyTheme(this.isDarkMode); // Aplica el tema correspondiente
  }

  // Método para aplicar el tema
  applyTheme(isDark: boolean) {
    if (isDark) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light'); // Guarda el tema en el almacenamiento local
  }

  // Método para establecer el tema inicial basado en las preferencias del sistema o almacenamiento local
  private setInitialTheme() {
    const savedTheme = localStorage.getItem('theme'); // Obtener el tema guardado
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches; // Usar la preferencia del sistema si no hay tema guardado
    }
    this.applyTheme(this.isDarkMode); // Aplica el tema
  }

  // Método para cerrar el menú
  closeMenu() {
    this.menuCtrl.close();
  }

  // Método para cerrar sesión
  async logout() {
    await this.authService.logout(); // Llama al método de cierre de sesión del servicio y espera su resolución
    this.closeMenu(); // Cierra el menú
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }
}
