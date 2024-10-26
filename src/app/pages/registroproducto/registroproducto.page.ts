import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router'; // Importa Router
import { ToastController } from '@ionic/angular'; // Importa ToastController

@Component({
  selector: 'app-registroproducto',
  templateUrl: './registroproducto.page.html',
  styleUrls: ['./registroproducto.page.scss'],
})
export class RegistroproductoPage implements OnInit {
  productForm: FormGroup;
  imageUrl: string = '';

  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private router: Router, // Inyecta Router
    private toastController: ToastController // Inyecta ToastController
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

  ngOnInit() {}

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 50,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      this.imageUrl = image.dataUrl || '';
      this.productForm.patchValue({ imagen: this.imageUrl });
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

      this.imageUrl = image.dataUrl || '';
      this.productForm.patchValue({ imagen: this.imageUrl });
    } catch (error) {
      console.error('Error al subir la foto:', error);
    }
  }

  async onSubmit() {
    if (this.productForm.valid) {
      const userId = '123'; // Reemplaza con el ID real del usuario.
      const productData = { ...this.productForm.value, userId };

      try {
        await this.userService.registerProduct(productData);
        console.log('Producto registrado:', productData);
        
        // Muestra un mensaje de éxito
        const toast = await this.toastController.create({
          message: 'Producto registrado correctamente.',
          duration: 2000,
          position: 'top'
        });
        await toast.present();

        this.productForm.reset();
        this.imageUrl = '';

        // Redirige a la página de inicio
        this.router.navigate(['/home']); // Ajusta la ruta según tu configuración
      } catch (error) {
        console.error('Error al registrar el producto:', error);
        // Mostrar un mensaje de error al usuario si es necesario
      }
    } else {
      console.log('Formulario no válido', this.productForm.errors);
      // Considera mostrar errores en la interfaz
    }
  }
}
