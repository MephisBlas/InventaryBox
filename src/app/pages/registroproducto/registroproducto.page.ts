import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AuthService } from 'src/app/services/auth.service'; // Importar AuthService

@Component({
  selector: 'app-registroproducto',
  templateUrl: './registroproducto.page.html',
  styleUrls: ['./registroproducto.page.scss'],
})
export class RegistroproductoPage implements OnInit {
  productForm: FormGroup;
  imageUrl: string = '';

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
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

  ngOnInit() {}

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 50,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    this.imageUrl = image.dataUrl || '';
    this.productForm.patchValue({ imagen: this.imageUrl });
  }

  async uploadPicture() {
    const image = await Camera.getPhoto({
      quality: 50,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });

    this.imageUrl = image.dataUrl || '';
    this.productForm.patchValue({ imagen: this.imageUrl });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const product = this.productForm.value;
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');

      // Añadir el ID de usuario al producto
      product.userId = loggedInUser.username; // Usa el nombre de usuario como ID

      const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');

      if (this.isProductDuplicate(product, existingProducts)) {
        alert('Este producto ya existe en el inventario.');
      } else {
        existingProducts.push(product);
        localStorage.setItem('products', JSON.stringify(existingProducts));
        alert('Producto registrado exitosamente.');
        this.productForm.reset();
        this.imageUrl = '';

        this.router.navigate(['/home']);
      }
    }
  }

  isProductDuplicate(product: any, existingProducts: any[]): boolean {
    return existingProducts.some(p => p.nombre === product.nombre && p.clase === product.clase && p.marca === product.marca && p.userId === product.userId);
  }
}
