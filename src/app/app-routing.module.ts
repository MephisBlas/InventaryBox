import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { NotFoundComponent } from './shared/not-found/not-found.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [authGuard] 
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
    loadChildren: () => import('./pages/menu/configuracion/configuracion.module').then( m => m.ConfiguracionPageModule),
    canActivate: [authGuard] 
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/menu/perfil/perfil.module').then( m => m.PerfilPageModule),
    canActivate: [authGuard] 
  },
  {
    path: 'registroproducto',
    loadChildren: () => import('./pages/registroproducto/registroproducto.module').then( m => m.RegistroproductoPageModule),
    
  },
  {
    path: 'cambionombre',
    loadChildren: () => import('./pages/menu/cambionombre/cambionombre.module').then( m => m.CambionombrePageModule),
    canActivate: [authGuard] 
  },
  {
    path: 'cambiopass',
    loadChildren: () => import('./pages/menu/cambiopass/cambiopass.module').then( m => m.CambiopassPageModule),
    canActivate: [authGuard] 
  },
  {
    path: 'notificaciones',
    loadChildren: () => import('./pages/menu/notificaciones/notificaciones.module').then( m => m.NotificacionesPageModule),
    canActivate: [authGuard] 
  },
  {
    path: 'modificarproducto/:id',
    loadChildren: () => import('./pages/modificarproducto/modificarproducto.module').then(m => m.ModificarproductoPageModule),
    canActivate: [authGuard] 
  },
  {
    path: 'graficos',
    loadChildren: () => import('./pages/menu/graficos/graficos.module').then( m => m.GraficosPageModule),
    canActivate: [authGuard] 
  },
  {
    path: '**', // Ruta para el 404
    component: NotFoundComponent
  },
  {
    path: 'graficos',
    loadChildren: () => import('./pages/graficos/graficos.module').then( m => m.GraficosPageModule)
  },
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
