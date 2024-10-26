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
    this.productsSubscription?.unsubscribe();
  }

  private loadUser() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    if (loggedInUser?.username) {
      this.username = loggedInUser.username;
    } else {
      this.router.navigate(['/login']);
    }
  }

  private loadProducts() {
    this.userService.loadProducts(); 
    this.productsSubscription = this.userService.products$.subscribe(products => {
      this.productos = products; 
    });
  }

  irARegistrarProducto() {
    this.router.navigate(['/registroproducto']);
  }

  goToModifyProduct(productId: number | undefined) {
    if (productId !== undefined) {
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
        this.loadProducts(); 
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
      producto.cantidad--;
      try {
        await this.userService.updateProduct(producto.id, producto);
        this.showToast(`Has vendido 1 ${producto.nombre}.`);
      } catch (error) {
        console.error('Error al actualizar el producto:', error);
        this.showToast('Error al actualizar el producto.');
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
