import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { Storage } from '@ionic/storage-angular'; // Importa Storage

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SQLite,
    EmailComposer,
    Storage, // Añade Storage a los proveedores
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private storage: Storage) {}

  async ngOnInit() {
    // Inicializa el almacenamiento cuando la app arranca
    await this.storage.create();
  }
}
