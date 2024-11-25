// auth.guard.ts
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Esperar la resolución de la promesa de isAuthenticated
  const isAuthenticated = await authService.isAuthenticated();

  // Verificar si el usuario está autenticado
  if (isAuthenticated) {
    return true; // Permite el acceso a la ruta
  } else {
    // Guardar la ruta actual para redirigir después de la autenticación
    const redirectUrl = state.url;
    router.navigate(['/login'], { queryParams: { redirectUrl } }); // Redirige a la página de login con parámetros
    return false; // Bloquea el acceso a la ruta
  }
};
