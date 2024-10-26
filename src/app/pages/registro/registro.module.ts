import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,  ReactiveFormsModule, } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroPageRoutingModule } from './registro-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { RegistroPage } from './registro.page';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RegistroPageRoutingModule,
    SharedModule,
    HttpClientModule, 
  ],
  declarations: [RegistroPage, ]
})
export class RegistroPageModule {}
