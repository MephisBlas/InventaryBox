import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule

import { IonicModule } from '@ionic/angular';

import { ModificarproductoPageRoutingModule } from './modificarproducto-routing.module';

import { ModificarproductoPage } from './modificarproducto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // Asegúrate de que esto esté aquí
    IonicModule,
    ModificarproductoPageRoutingModule
  ],
  declarations: [ModificarproductoPage]
})
export class ModificarproductoPageModule {}
