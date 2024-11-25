import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Product } from 'src/app/models/product.models';
import { Subscription } from 'rxjs';
import { Storage } from '@ionic/storage-angular'; // Importa Storage

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
    private toastController: ToastController,
    private storage: Storage // Inyección de Storage
  ) {}

  ngOnInit() {
    this.setInitialTheme();
    this.loadUser(); // Cargar usuario
    this.loadProducts(); // Cargar productos
  }

  ngOnDestroy() {
    this.productsSubscription?.unsubscribe(); // Desuscribirse de la observación de productos
  }

  private async loadUser() {
    // Cargar el usuario desde el almacenamiento persistente usando @ionic/storage
    const loggedInUser = await this.storage.get('loggedInUser');
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
    this.isDarkMode = event.detail.checked;
    this.applyTheme(this.isDarkMode);
  }

  applyTheme(isDark: boolean) {
    document.body.classList.toggle('dark-theme', isDark);
    document.body.classList.toggle('light-theme', !isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  private setInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.applyTheme(this.isDarkMode);
  }

  closeMenu() {
    this.menuCtrl.close();
  }

  async logout() {
    await this.authService.logout();
    await this.storage.remove('loggedInUser'); // Eliminar usuario de la persistencia
    this.closeMenu();
    this.router.navigate(['/login']);
  }

  async eliminarProducto(producto: Product): Promise<void> {
    if (!producto || producto.id === undefined) {
      console.error('Producto inválido:', producto);
      return;
    }

    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (confirmDelete) {
      try {
        await this.userService.deleteProduct(producto.id);
        this.showToast('Producto eliminado con éxito.');
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        this.showToast('Error al eliminar el producto.');
      }
    }
  }

  async venderProducto(producto: Product): Promise<void> {
    if (!producto || producto.id === undefined) {
      console.error('Producto inválido:', producto);
      return;
    }

    if (producto.cantidad > 0) {
      try {
        await this.userService.sellProduct(producto.id, 1); // Vender 1 producto
        this.showToast(`Has vendido 1 ${producto.nombre}.`);
      } catch (error) {
        console.error('Error al vender el producto:', error);
        this.showToast('Error al vender el producto.');
      }
    } else {
      this.showToast('No hay suficiente stock para vender este producto.');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }
}
