import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'recuperacionpass',
    loadChildren: () => import('./pages/recuperacionpass/recuperacionpass.module').then( m => m.RecuperacionpassPageModule)
  },
  {
    path: 'configuracion',
    loadChildren: () => import('./pages/menu/configuracion/configuracion.module').then( m => m.ConfiguracionPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/menu/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'registroproducto',
    loadChildren: () => import('./pages/registroproducto/registroproducto.module').then( m => m.RegistroproductoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
