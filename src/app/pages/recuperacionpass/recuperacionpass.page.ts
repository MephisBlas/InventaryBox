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
  recoveryForm: FormGroup; // FormGroup para la recuperación de contraseña

  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder // Inyecta FormBuilder
  ) {
    // Inicializa el formulario con validaciones
    this.recoveryForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]] // Valida el correo electrónico
    });
  }

  ngOnInit() {
    // Lógica al inicializar el componente
  }

  // Método para volver a la página anterior
  goBack() {
    this.router.navigate(['/login']); // Cambia la ruta según tu configuración de enrutamiento
  }

  // Método para manejar la recuperación de contraseña
  recoverPassword() {
    if (this.recoveryForm.valid) {
      const email = this.recoveryForm.value.email; // Captura el correo electrónico

      this.userService.recoverPassword(email).then(() => {
        console.log('Correo de recuperación enviado');
        // Aquí puedes agregar lógica adicional, como mostrar un mensaje de éxito
      }).catch(error => {
        console.error('Error al enviar el correo de recuperación:', error);
        // Maneja el error (muestra un mensaje al usuario, etc.)
      });
    } else {
      console.log('Formulario inválido');
      // Aquí puedes agregar lógica para mostrar mensajes de error de validación
    }
  }
}
