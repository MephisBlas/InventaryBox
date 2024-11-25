import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service'; // Asegúrate de importar el UserService
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importa FormBuilder y FormGroup

@Component({
  selector: 'app-recuperacionpass',
  templateUrl: './recuperacionpass.page.html',
  styleUrls: ['./recuperacionpass.page.scss'],
})
export class RecuperacionpassPage implements OnInit {
 // FormGroup para la recuperación de contraseña

  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder // Inyecta FormBuilder
  ) {
   
  }

  ngOnInit() {
    // Lógica al inicializar el componente
  }

  // Método para volver a la página anterior
  goBack() {
    this.router.navigate(['/login']); // Cambia la ruta según tu configuración de enrutamiento
  }
}
