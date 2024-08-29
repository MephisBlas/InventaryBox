import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {

  constructor() { }

  ngOnInit() {
    this.loadTheme();
  }

  toggleTheme(event: any) {
    const isDarkMode = event.detail.checked;
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    this.saveTheme(isDarkMode);
  }

  private saveTheme(isDarkMode: boolean) {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }

  private loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
}
