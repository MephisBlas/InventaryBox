import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModificarproductoPage } from './modificarproducto.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarproductoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModificarproductoPageRoutingModule {}
