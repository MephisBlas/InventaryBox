import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroproductoPage } from './registroproducto.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroproductoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroproductoPageRoutingModule {}
