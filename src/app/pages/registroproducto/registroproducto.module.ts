import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Importa ReactiveFormsModule
import { IonicModule } from '@ionic/angular';
import { RegistroproductoPageRoutingModule } from './registroproducto-routing.module';
import { RegistroproductoPage } from './registroproducto.page';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,  // Agrega ReactiveFormsModule aquí
    IonicModule,
    RegistroproductoPageRoutingModule, 
    SharedModule
  ],
  declarations: [RegistroproductoPage, ]
})
export class RegistroproductoPageModule {}
