import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-back-arrow',
  templateUrl: './back-arrow.component.html',
  styleUrls: ['./back-arrow.component.scss'],
})
export class BackArrowComponent {
  constructor(private location: Location) {}

  goBack() {
    console.log('Back button clicked');
    this.location.back(); // Navega hacia atrás en el historial
  }
}
