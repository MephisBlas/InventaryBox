const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Configura el transportador de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // O el servicio que desees utilizar
  auth: {
    user: 'tucorreo@gmail.com', // Tu correo
    pass: 'tucontraseña' // Tu contraseña (usa App Password si tienes habilitada la verificación en dos pasos)
  }
});

app.post('/send-email', (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: 'tucorreo@gmail.com',
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('Correo enviado: ' + info.response);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
