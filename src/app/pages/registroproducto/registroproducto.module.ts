import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Importa ReactiveFormsModule
import { IonicModule } from '@ionic/angular';

import { RegistroproductoPageRoutingModule } from './registroproducto-routing.module';
import { RegistroproductoPage } from './registroproducto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,  // Agrega ReactiveFormsModule aquí
    IonicModule,
    RegistroproductoPageRoutingModule
  ],
  declarations: [RegistroproductoPage]
})
export class RegistroproductoPageModule {}
