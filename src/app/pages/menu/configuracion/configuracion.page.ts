import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {
  darkMode: boolean = false;

  constructor() { }

  ngOnInit() {
    this.loadTheme();
  }

  toggleTheme(event: any) {
    this.darkMode = event.detail.checked;
    if (this.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    this.saveTheme(this.darkMode);
  }

  private saveTheme(isDarkMode: boolean) {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }

  private loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.darkMode = true;
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      this.darkMode = false;
      document.documentElement.removeAttribute('data-theme');
    }
  }
}
