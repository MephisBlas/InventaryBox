import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Importa Router para redirigir

@Component({
  selector: 'app-registroproducto',
  templateUrl: './registroproducto.page.html',
  styleUrls: ['./registroproducto.page.scss'],
})
export class RegistroproductoPage implements OnInit {
  productForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) { // Inyecta Router
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      clase: ['', Validators.required],
      marca: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      cantidad: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.productForm.valid) {
      const product = this.productForm.value;

      // Obtener productos existentes del localStorage
      const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');

      if (this.isProductDuplicate(product, existingProducts)) {
        alert('Este producto ya existe en el inventario.');
      } else {
        // Añadir nuevo producto a la lista
        existingProducts.push(product);
        localStorage.setItem('products', JSON.stringify(existingProducts));
        alert('Producto registrado exitosamente.');
        this.productForm.reset();

        // Redirige al home después de registrar el producto
        this.router.navigate(['/home']);
      }
    }
  }

  isProductDuplicate(product: any, existingProducts: any[]): boolean {
    return existingProducts.some(p => p.nombre === product.nombre && p.clase === product.clase && p.marca === product.marca);
  }
}
