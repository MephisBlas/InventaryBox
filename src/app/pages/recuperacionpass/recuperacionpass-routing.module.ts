import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecuperacionpassPage } from './recuperacionpass.page';

const routes: Routes = [
  {
    path: '',
    component: RecuperacionpassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecuperacionpassPageRoutingModule {}
