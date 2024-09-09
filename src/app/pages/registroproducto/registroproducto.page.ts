import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registroproducto',
  templateUrl: './registroproducto.page.html',
  styleUrls: ['./registroproducto.page.scss'],
})
export class RegistroproductoPage implements OnInit {
  productForm: FormGroup;
  products: any[] = [];  // Lista de productos existentes para validación

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      clase: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      cantidad: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.productForm.valid) {
      const product = this.productForm.value;
      if (this.isProductDuplicate(product)) {
        alert('Este producto ya existe en el inventario.');
      } else {
        // Aquí se procesa el envío del formulario
        this.products.push(product);
        console.log('Producto:', product);
      }
    }
  }

  isProductDuplicate(product: any): boolean {
    return this.products.some(p => p.nombre === product.nombre && p.clase === product.clase);
  }
}
