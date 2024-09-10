import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; // Importa IonicModule
import { BackArrowComponent } from './back-arrow/back-arrow.component';

@NgModule({
  declarations: [BackArrowComponent],
  imports: [
    CommonModule,
    IonicModule // Asegúrate de importar IonicModule
  ],
  exports: [BackArrowComponent] // Exporta el componente para usarlo en otros módulos
})
export class SharedModule { }
