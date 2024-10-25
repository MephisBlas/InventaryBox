import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service'; // Asegúrate de importar el UserService

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {
  darkMode: boolean = false;

  constructor(private navCtrl: NavController, private userService: UserService) {} // Inyecta UserService

  ngOnInit() {
    this.loadTheme();
  }

  async toggleTheme(event: any) {
    this.darkMode = event.detail.checked;
    if (this.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    await this.saveTheme(this.darkMode ? 'dark' : 'light');
  }

  private async saveTheme(theme: string) {
    await this.userService.saveTheme(theme);
  }

  private async loadTheme() {
    const savedTheme = await this.userService.loadTheme();
    if (savedTheme === 'dark') {
      this.darkMode = true;
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      this.darkMode = false;
      document.documentElement.removeAttribute('data-theme');
    }
  }

  goToMainMenu() {
    this.navCtrl.navigateRoot('/menu-principal'); // Cambia la ruta según sea necesario
  }
}
