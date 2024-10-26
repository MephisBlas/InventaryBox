import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarproductoPageRoutingModule } from './modificarproducto-routing.module';

import { ModificarproductoPage } from './modificarproducto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarproductoPageRoutingModule
  ],
  declarations: [ModificarproductoPage]
})
export class ModificarproductoPageModule {}
