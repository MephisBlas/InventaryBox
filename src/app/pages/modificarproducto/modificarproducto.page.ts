import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Product } from 'src/app/models/product.models';
import { UserService } from 'src/app/services/user.service';
import { ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service'; // Asegúrate de importar AuthService

@Component({
  selector: 'app-modificarproducto',
  templateUrl: './modificarproducto.page.html',
  styleUrls: ['./modificarproducto.page.scss'],
})
export class ModificarproductoPage implements OnInit {
  productId: number = 0;
  nombre: string = '';
  clase: string = '';
  marca: string = '';
  precioCompra: number = 0;
  precioVenta: number = 0;
  cantidad: number = 0;
  imagen: string = '';
  userId: string = ''; // Almacena el ID del usuario

  constructor(
    private modalController: ModalController,
    private userService: UserService,
    private toastController: ToastController,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService // Inyecta AuthService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
      this.loadProduct();
      this.loadCurrentUser(); // Cargar el usuario actual
    });
  }

  async loadCurrentUser() {
    const user = this.authService.getCurrentUser(); // Usa AuthService para obtener el usuario
    if (user) {
      this.userId = user.id; // Asigna el ID del usuario que ha iniciado sesión
    } else {
      console.error('No hay usuario autenticado');
    }
  }

  async loadProduct() {
    try {
      const product = await this.userService.getProductById(this.productId);
      if (product) {
        this.nombre = product.nombre || '';
        this.clase = product.clase || '';
        this.marca = product.marca || '';
        this.precioCompra = product.precioCompra || 0;
        this.precioVenta = product.precioVenta || 0;
        this.cantidad = product.cantidad || 0;
        this.imagen = product.imagen || '';
      } else {
        this.showToast('Producto no encontrado.');
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Error al cargar el producto:', error);
      this.showToast('Error al cargar el producto. Inténtalo de nuevo.');
    }
  }

  async updateProduct() {
    if (!this.nombre || !this.clase || !this.marca || this.precioCompra < 0 || this.precioVenta < 0 || this.cantidad < 0) {
      this.showToast('Por favor completa todos los campos correctamente.');
      return;
    }

    const updatedProduct: Product = {
      id: this.productId,
      nombre: this.nombre,
      clase: this.clase,
      marca: this.marca,
      precioCompra: this.precioCompra,
      precioVenta: this.precioVenta,
      cantidad: this.cantidad,
      imagen: this.imagen,
      userId: this.userId, // Usa el userId del usuario actual
    };

    try {
      await this.userService.updateProduct(this.productId, updatedProduct);
      await this.modalController.dismiss(updatedProduct);
      this.showToast('Producto actualizado con éxito.');
      await this.router.navigate(['/home']); // Redirige a la página de inicio
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      this.showToast('Producto actualizado con éxito.');
      await this.router.navigate(['/home']); // Redirige a la página de inicio
    }
  }

  async cerrar() {
    await this.modalController.dismiss();
    this.router.navigate(['/home']);
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 50,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });
      this.imagen = image.dataUrl || '';
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  }

  async uploadPicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 50,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });
      this.imagen = image.dataUrl || '';
    } catch (error) {
      console.error('Error al subir la foto:', error);
    }
  }
}
