import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
})
export class GraficosPage implements OnInit {

  constructor() {}

  ngOnInit() {
    this.createChart();
  }

  createChart() {
    const ctx = document.getElementById('canvas') as HTMLCanvasElement;
    const myChart = new Chart(ctx, {
      type: 'bar', // Cambia el tipo según tus necesidades
      data: {
        labels: ['Producto 1', 'Producto 2', 'Producto 3'],
        datasets: [{
          label: 'Ventas',
          data: [12, 19, 3], // Datos de muestra
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
