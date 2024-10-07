import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambiopassPage } from './cambiopass.page';

const routes: Routes = [
  {
    path: '',
    component: CambiopassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambiopassPageRoutingModule {}
