import { Injectable } from '@angular/core';
import * as postmark from 'postmark';  // Importar la librería de Postmark

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private client: postmark.ServerClient;

  constructor() {
    // Inicializamos el cliente de Postmark con el Server Token
    this.client = new postmark.ServerClient('8a6b07d2-9835-49a5-abae-01af0f5e1be2');  // Reemplaza con tu Server Token de Postmark
  }

  // Método para enviar correo de confirmación
  async sendConfirmationEmail(to: string, username: string): Promise<boolean> {
    const emailParams = {
      From: 'fe.cisternast@duocuc.cl ', // Remitente verificado en Postmark
      To: to,
      Subject: 'Registro Exitoso en InventaryBox',
      HtmlBody: `<strong>¡Hola ${username}!</strong><br>Gracias por registrarte en InventaryBox. Tu registro se ha completado con éxito.`,
      TextBody: `¡Hola ${username}!\nGracias por registrarte en InventaryBox. Tu registro se ha completado con éxito.`,
      MessageStream: 'registro-exitoso', // El nombre del stream configurado en Postmark
    };

    try {
      await this.client.sendEmail(emailParams);
      console.log('Correo de confirmación enviado correctamente.');
      return true; // Si el correo se envió correctamente
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      return false; // Si hubo un error al enviar el correo
    }
  }
}
