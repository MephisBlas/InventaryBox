import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { Product } from 'src/app/models/product.models';

@Component({
  selector: 'app-modificarproducto',
  templateUrl: './modificarproducto.page.html',
  styleUrls: ['./modificarproducto.page.scss'],
})
export class ModificarproductoPage implements OnInit {
  productForm: FormGroup;
  imageUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastController: ToastController,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      clase: ['', Validators.required],
      marca: ['', Validators.required],
      precioCompra: ['', [Validators.required, Validators.min(0)]],
      precioVenta: ['', [Validators.required, Validators.min(0)]],
      cantidad: ['', [Validators.required, Validators.min(0)]],
      imagen: [''],
    });
  }

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    } else {
      console.error('No se ha proporcionado un ID de producto.');
    }
  }

  async loadProduct(productId: string) {
    try {
      const product = await this.userService.getProductById(parseInt(productId));
      if (product) {
        this.productForm.patchValue({
          nombre: product.nombre,
          clase: product.clase,
          marca: product.marca,
          precioCompra: product.precioCompra,
          precioVenta: product.precioVenta,
          cantidad: product.cantidad,
          imagen: product.imagen,
        });
        this.imageUrl = product.imagen || ''; // Muestra la imagen si existe
      } else {
        console.error('Producto no encontrado.');
      }
    } catch (error) {
      console.error('Error al cargar el producto:', error);
    }
  }

  async onSubmit() {
    if (this.productForm.valid) {
      const productId = this.route.snapshot.paramMap.get('id');
      const productData: Product = { ...this.productForm.value, imagen: this.imageUrl }; // Incluye imagen

      try {
        if (productId) {
          const success = await this.userService.updateProduct(parseInt(productId), productData);
          if (success) {
            const toast = await this.toastController.create({
              message: 'Producto actualizado correctamente.',
              duration: 2000,
              position: 'top'
            });
            await toast.present();
            this.router.navigate(['/home']);
          } else {
            const toast = await this.toastController.create({
              message: 'Error al actualizar el producto. Inténtalo de nuevo.',
              duration: 2000,
              position: 'top'
            });
            await toast.present();
          }
        }
      } catch (error) {
        console.error('Error al actualizar el producto:', error);
      }
    } else {
      console.log('Formulario no válido', this.productForm.errors);
      const toast = await this.toastController.create({
        message: 'Por favor, completa todos los campos requeridos.',
        duration: 2000,
        position: 'top'
      });
      await toast.present();
    }
  }
}
