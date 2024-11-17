import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Product } from 'src/app/models/product.models';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Chart } from 'chart.js';
import { Venta } from 'src/app/models/ventas.models';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
})
export class GraficosPage implements OnInit, OnDestroy {
  productos: Product[] = [];
  private productsSubscription: Subscription | null = null;
  barChart: any;
  pieChart: any;
  hasSales: boolean = false; // Verifica si hay ventas

  constructor(private userService: UserService, private toastController: ToastController) {}

  ngOnInit() {
    // Suscribirse a los cambios de productos
    this.productsSubscription = this.userService.products$.subscribe(async (products) => {
      this.productos = products;
      await this.loadSalesData();  // Cargar las ventas de cada producto
      this.checkSales();  // Verifica si hay ventas
      this.createCharts();  // Crear los gráficos
    });

    // Cargar productos desde la base de datos
    this.userService.loadProducts();
  }

  ngOnDestroy() {
    // Limpiar suscripción cuando el componente se destruye
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }

    // Destruir gráficos para evitar memory leaks
    if (this.barChart) {
      this.barChart.destroy();
    }
    if (this.pieChart) {
      this.pieChart.destroy();
    }
  }

  // Verificar si hay ventas
  checkSales() {
    // Revisamos si al menos uno de los productos tiene ventas > 0
    this.hasSales = this.productos.some(p => (p.ventas || 0) > 0);
    console.log('¿Hay ventas?', this.hasSales); // Verificamos si hay ventas
  }

  // Cargar las ventas de cada producto
  async loadSalesData() {
    for (let producto of this.productos) {
      try {
        const sales = await this.userService.getSalesByProductId(producto.id);
        producto.ventas = sales || 0;  // Asignamos la cantidad de ventas al producto, asegurando que no sea null
      } catch (error) {
        console.error('Error al cargar ventas para el producto', producto.id, error);
        producto.ventas = 0;  // Si hay error, asignamos 0 ventas
      }
    }
  }

  // Crear los gráficos (barras y pastel)
  createCharts() {
    if (this.barChart || this.pieChart) {
      this.updateCharts(); // Si los gráficos ya existen, actualizamos
    } else {
      this.createBarChart(); // Si no existen, los creamos
      this.createPieChart();
    }
  }

  // Crear gráfico de barras
  createBarChart() {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.productos.map(p => p.nombre),  // Nombres de productos
        datasets: [{
          label: 'Ventas',
          data: this.productos.map(p => p.ventas || 0),  // Usamos 0 si no hay ventas
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                const productName = tooltipItem.label;
                const sales = tooltipItem.raw;
                return `${productName}: ${sales} ventas`;
              }
            }
          }
        }
      }
    });
  }

  // Crear gráfico de pastel
  createPieChart() {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.productos.map(p => p.nombre),  // Nombres de productos
        datasets: [{
          label: 'Distribución de Ventas',
          data: this.productos.map(p => p.ventas || 0),  // Usamos 0 si no hay ventas
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                const productName = tooltipItem.label;
                const sales = tooltipItem.raw;
                return `${productName}: ${sales} ventas`;  // Mostrar nombre del producto y cantidad de ventas
              }
            }
          }
        }
      }
    });
  }

  // Actualizar los gráficos
  updateCharts() {
    // Si no hay ventas, mostramos los gráficos vacíos con 0 ventas.
    if (!this.hasSales) {
      console.log('No hay ventas para mostrar.');
    }

    // Actualizar gráfico de barras
    if (this.barChart) {
      this.barChart.data.labels = this.productos.map(p => p.nombre);
      this.barChart.data.datasets[0].data = this.productos.map(p => p.ventas || 0);
      this.barChart.update();
    }
     
    // Actualizar gráfico de pastel
    if (this.pieChart) {
      this.pieChart.data.labels = this.productos.map(p => p.nombre);
      this.pieChart.data.datasets[0].data = this.productos.map(p => p.ventas || 0);
      this.pieChart.update();
    }
  }
}
