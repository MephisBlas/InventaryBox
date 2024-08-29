import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private menuCtrl: MenuController) {}

  // Método para cerrar el menú
  closeMenu() {
    this.menuCtrl.close();
  }

  // Método para cerrar sesión
  logout() {
    // Aquí puedes agregar la lógica para cerrar sesión
    console.log('Cerrar sesión');
    this.closeMenu();
  }
}

