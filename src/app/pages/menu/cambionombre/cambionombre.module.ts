import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambionombrePageRoutingModule } from './cambionombre-routing.module';

import { CambionombrePage } from './cambionombre.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CambionombrePageRoutingModule,
    SharedModule 
  ],
  declarations: [CambionombrePage, ]
})
export class CambionombrePageModule {}
