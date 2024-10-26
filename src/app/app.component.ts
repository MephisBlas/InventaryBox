import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inicio', url: '/home', icon: 'home' },
    { title: 'Gráficos', url: '/graficos', icon: 'analytics' },
    { title: 'Configuraciones', url: '/configuracion', icon: 'settings' },
    { title: 'Perfil', url: '/perfil', icon: 'person' },
  ];

  constructor(private router: Router, private authService: AuthService) {}

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
