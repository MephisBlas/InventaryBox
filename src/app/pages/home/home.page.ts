import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Product } from 'src/app/models/product.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  isDarkMode = false;
  username: string = '';
  productos: Product[] = [];
  private productsSubscription: Subscription | null = null;

  constructor(
    private menuCtrl: MenuController,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.setInitialTheme();
    this.loadUser();
    this.loadProducts();
  }

  ngOnDestroy() {
    // Desuscribirse de la observación de productos para evitar fugas de memoria
    this.productsSubscription?.unsubscribe();
  }

  private loadUser() {
    // Cargar el usuario desde el almacenamiento local
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    if (loggedInUser?.username) {
      this.username = loggedInUser.username;
    } else {
      this.router.navigate(['/login']); // Si no hay usuario, redirigir al login
    }
  }

  private loadProducts() {
    // Cargar productos desde el servicio de usuario
    this.userService.loadProducts();
    this.productsSubscription = this.userService.products$.subscribe(products => {
      this.productos = products;
    });
  }

  irARegistrarProducto() {
    // Navegar a la página de registro de productos
    this.router.navigate(['/registroproducto']);
  }

  goToModifyProduct(productId: number | undefined) {
    if (productId !== undefined) {
      // Navegar a la página de modificación del producto
      this.router.navigate([`/modificarproducto/${productId}`]);
    } else {
      console.error('ID de producto inválido:', productId);
    }
  }

  toggleTheme(event: CustomEvent) {
    // Cambiar el tema (oscuro/claro)
    this.isDarkMode = event.detail.checked;
    this.applyTheme(this.isDarkMode);
  }

  applyTheme(isDark: boolean) {
    // Aplicar la clase correspondiente al cuerpo para el tema
    document.body.classList.toggle('dark-theme', isDark);
    document.body.classList.toggle('light-theme', !isDark);
    // Guardar la preferencia de tema en el almacenamiento local
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  private setInitialTheme() {
    // Cargar el tema inicial desde el almacenamiento local
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.applyTheme(this.isDarkMode);
  }

  closeMenu() {
    // Cerrar el menú lateral
    this.menuCtrl.close();
  }

  async logout() {
    // Cerrar sesión y redirigir a la página de login
    await this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/login']);
  }

  // Método para eliminar un producto
  async eliminarProducto(producto: Product): Promise<void> {
    if (!producto || producto.id === undefined) {
      console.error('Producto inválido:', producto);
      return;
    }

    // Confirmación antes de eliminar el producto
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (confirmDelete) {
      try {
        // Llamamos al servicio para eliminar el producto
        await this.userService.deleteProduct(producto.id);
        this.showToast('Producto eliminado con éxito.');
        // No es necesario recargar los productos, ya que el observable lo manejará automáticamente
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        this.showToast('Error al eliminar el producto.');
      }
    }
  }

  // Método para vender un producto
  async venderProducto(producto: Product): Promise<void> {
    if (!producto || producto.id === undefined) {
      console.error('Producto inválido:', producto);
      return;
    }

    // Verificar si hay suficiente cantidad en stock
    if (producto.cantidad > 0) {
      try {
        // Llamamos al servicio para registrar la venta y actualizar la cantidad del producto
        await this.userService.sellProduct(producto.id, 1); // Vender 1 producto

        this.showToast(`Has vendido 1 ${producto.nombre}.`);
        // No es necesario llamar a loadProducts() aquí, ya que la actualización ya se manejará mediante el observable
      } catch (error) {
        console.error('Error al vender el producto:', error);
        this.showToast('Error al vender el producto.');
      }
    } else {
      this.showToast('No hay suficiente stock para vender este producto.');
    }
  }

  // Método para mostrar mensajes de toast
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }
}
