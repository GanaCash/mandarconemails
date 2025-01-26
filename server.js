const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'caxespana@gmail.com', // Cambia esto por tu correo
    pass: 'odag hgem gjij cjfr' // Cambia esto por tu contraseña
  }
});

// Ruta para enviar el correo
app.post('/send-email', (req, res) => {
  const { emailUser, emailProvider, country, iban, promoCode, amount } = req.body;

  // Plantilla HTML del correo
  const emailHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email con Sentido</title>
      <style>
        /* Estilos aquí */
      </style>
    </head>
    <body>
      <div class="email-container">
        <!-- Header Section -->
        <div class="email-header">
          <img src="https://ganacash.vercel.app/Fondo.png" alt="GanaCash Logo">
          <h2>¡Tu Dinero Está en Camino!</h2>
        </div>

        <!-- Content Section -->
        <div class="email-content">
          <h1>¡Hola <span>${emailUser}</span>!</h1>
          <p>¡Excelentes noticias! Tu solicitud ha sido aprobada y estamos procesando tu dinero para que lo recibas en las próximas 24 horas.</p>
          <h2>Detalles de tu transacción:</h2>
          <ul>
            <li>
              <img src="https://cdn-icons-png.flaticon.com/512/12740/12740855.png" alt="Icono Monto">
              Cantidad aprobada: <span> 1 euro</span>
            </li>
            <li>
              <img src="https://cdn-icons-png.flaticon.com/512/3073/3073484.png " alt="Icono Tiempo">
              Tiempo estimado de transferencia: <span>24 horas</span>
            </li>
            <li>
              <img src="https://cdn-icons-png.flaticon.com/512/5446/5446963.png " alt="Icono Email">
              Has seleccionado: <span>${emailProvider}</span>
            </li>
            ${iban ? `<li>IBAN: <span>${iban}</span></li>` : ''}
            <li>
              <img src="https://cdn-icons-png.flaticon.com/512/9068/9068642.png" alt="Icono Email">
              Email: <span>${emailUser}</span>
            </li>
          </ul>
        </div>

        <!-- Footer Section -->
        <div class="email-footer">
          <p>Síguenos en nuestras redes sociales:</p>
          <div class="social-icons">
            <a href="https://facebook.com" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/1384/1384005.png " alt="Facebook">
            </a>
            <a href="https://instagram.com" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/1384/1384015.png " alt="Instagram">
            </a>
            <a href="https://youtube.com" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/1384/1384028.png " alt="YouTube">
            </a>
          </div>
          <p>© 2025 GanaCash. Todos los derechos reservados.</p>
          <p>Este email fue enviado de manera automática a <span>${emailUser}</span></p>
          <a href="mailto:ganacash@ganacash.es">Contáctanos</a>
          <br>
          <a href="mailto:ganacash@ganacash.es">¿No eres tú?</a>
        </div>
      </div>
    </body>
    </html>
  `;

  // Configuración del correo
  const mailOptions = {
    from: 'caxespana@gmail.com',
    to: emailUser,
    subject: 'Confirmación de Pago',
    html: emailHtml, // Usamos HTML en lugar de texto plano
  };

  // Enviar el correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ success: false, message: 'Error al enviar el correo' });
    }
    res.json({ success: true, message: 'Correo enviado con éxito' });
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
