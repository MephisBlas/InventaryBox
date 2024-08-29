import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecuperacionpassPageRoutingModule } from './recuperacionpass-routing.module';

import { RecuperacionpassPage } from './recuperacionpass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecuperacionpassPageRoutingModule
  ],
  declarations: [RecuperacionpassPage]
})
export class RecuperacionpassPageModule {}
