import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Asegúrate de importar ReactiveFormsModule

import { IonicModule } from '@ionic/angular';

import { RecuperacionpassPageRoutingModule } from './recuperacionpass-routing.module';

import { RecuperacionpassPage } from './recuperacionpass.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    IonicModule,
    RecuperacionpassPageRoutingModule,
    SharedModule 
  ],
  declarations: [RecuperacionpassPage]
})
export class RecuperacionpassPageModule {}
