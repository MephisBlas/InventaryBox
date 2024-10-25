import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service'; // Asegúrate de que esta ruta sea correcta
import { UserService } from 'src/app/services/user.service'; // Importa el UserService
import { Product } from 'src/app/models/product.models'; // Asegúrate de que esta ruta sea correcta

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  isDarkMode = false; // Variable para controlar el estado del tema
  username: string = ''; // Propiedad para el nombre de usuario
  productos: Product[] = []; // Lista de productos

  constructor(
    private menuCtrl: MenuController,
    private authService: AuthService,
    private userService: UserService, // Inyecta UserService
    private router: Router
  ) {}

  ngOnInit() {
    this.setInitialTheme(); // Establece el tema inicial
    this.loadUser(); // Carga el nombre del usuario
    this.cargarProductos(); // Carga los productos
  }

  // Método para cargar el nombre del usuario desde el almacenamiento local
  private loadUser() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');

    if (loggedInUser && loggedInUser.username) {
      this.username = loggedInUser.username;
    } else {
      this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
    }
  }

  // Método para cargar los productos
  async cargarProductos() {
    try {
      this.productos = await this.userService.getProducts(); // Carga los productos desde el servicio
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  }

  // Método para navegar a la página de registro de productos
  irARegistrarProducto() {
    this.router.navigate(['/registroproducto']); // Navega a la página de registro
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

  // Método para establecer el tema inicial
  private setInitialTheme() {
    const savedTheme = localStorage.getItem('theme'); // Obtener el tema guardado
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches; // Usar la preferencia del sistema
    }
    this.applyTheme(this.isDarkMode); // Aplica el tema
  }

  // Método para cerrar el menú
  closeMenu() {
    this.menuCtrl.close();
  }

  // Método para cerrar sesión
  async logout() {
    await this.authService.logout(); // Llama al método de cierre de sesión
    this.closeMenu(); // Cierra el menú
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }

  //borrar producto
  async eliminarProducto(producto: Product): Promise<void> {
    if (!producto || producto.id === undefined) {
      console.error('Producto inválido:', producto);
      return; // Salir si el producto es nulo o no tiene un id
    }
  
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await this.userService.deleteProduct(producto.id);
        this.cargarProductos(); // Recargar la lista de productos
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
      }
    }
  }
  
  
  
}