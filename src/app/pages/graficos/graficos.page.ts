import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Product } from 'src/app/models/product.models';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
})
export class GraficosPage implements OnInit, AfterViewInit, OnDestroy {
  productos: Product[] = [];
  private productsSubscription: Subscription | null = null;
  barChart: any;
  pieChart: any;

  constructor(private userService: UserService, private toastController: ToastController) {}

  ngOnInit() {
    // Suscribirse a los cambios de productos
    this.productsSubscription = this.userService.products$.subscribe(products => {
      this.productos = products;
      this.updateCharts(); // Actualizar gráficos con los productos más recientes
    });

    // Cargar productos desde la base de datos
    this.userService.loadProducts();
  }

  ngAfterViewInit() {
    // Crear los gráficos al inicializar la vista
    this.createBarChart();
    this.createPieChart();
  }

  ngOnDestroy() {
    // Limpiar suscripción cuando el componente se destruye
    this.productsSubscription?.unsubscribe();
  }

  // Método para vender un producto
  async sellProduct(productId: number): Promise<void> {
    const producto = this.productos.find(p => p.id === productId);

    if (!producto) {
      console.error('Producto no encontrado.');
      return;
    }

    if (producto.cantidad > 0) {
      producto.cantidad--;  // Reducir la cantidad en stock
      producto.ventas = (producto.ventas || 0) + 1; // Incrementar las ventas

      try {
        // Actualiza el producto en la base de datos
        await this.userService.updateProduct(producto.id, producto);
        this.showToast(`Has vendido 1 ${producto.nombre}.`);
        this.updateCharts();  // Actualizar los gráficos
      } catch (error) {
        console.error('Error al actualizar el producto:', error);
        this.showToast('Error al actualizar el producto.');
      }
    } else {
      this.showToast('No hay suficiente stock para vender este producto.');
    }
  }

  // Método para mostrar un toast
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }

  // Crear gráfico de barras
  createBarChart() {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.productos.map(p => p.nombre),
        datasets: [{
          label: 'Ventas',
          data: this.productos.map(p => p.ventas || 0),
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
        labels: this.productos.map(p => p.nombre),
        datasets: [{
          label: 'Distribución de Ventas',
          data: this.productos.map(p => p.ventas || 0),
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
          }
        }
      }
    });
  }

  // Actualizar los gráficos
  updateCharts() {
    if (this.barChart) {
      this.barChart.data.labels = this.productos.map(p => p.nombre);
      this.barChart.data.datasets[0].data = this.productos.map(p => p.ventas || 0);
      this.barChart.update();
    }

    if (this.pieChart) {
      this.pieChart.data.labels = this.productos.map(p => p.nombre);
      this.pieChart.data.datasets[0].data = this.productos.map(p => p.ventas || 0);
      this.pieChart.update();
    }
  }
}
