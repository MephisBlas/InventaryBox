import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambiopassPageRoutingModule } from './cambiopass-routing.module';

import { CambiopassPage } from './cambiopass.page';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CambiopassPageRoutingModule,
    SharedModule 
  ],
  declarations: [CambiopassPage, ]
})
export class CambiopassPageModule {}
