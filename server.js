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
    user: 'ganacash.oficial@gmail.com', // Cambia esto por tu correo
    pass: 'rtgi ksgb iyoy aulg' // Cambia esto por tu contraseña
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
         /* General Styles */
 body {
   margin: 0;
   padding: 0;
   font-family: 'Arial', sans-serif;
   background-color: #f9fafb;
   color: #333;
 }
 .email-container {
   max-width: 600px;
   margin: 40px auto;
   background: #ffffff;
   border-radius: 12px;
   overflow: hidden;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
 }
 /* Header Styles */
 .email-header {
   background: linear-gradient(blue, blue);
   color: white;
   text-align: center;
   padding: 40px 20px;
 }
 .email-header img {
   max-width: 150px;
   margin-bottom: 15px;
 }
 .email-header h2 {
   font-size: 28px;
   margin: 10px 0;
   line-height: 1.4;
 }
 /* Content Styles */
 .email-content {
   padding: 20px;
   line-height: 1.8;
   font-size: 16px;
 }
 .email-content h1 {
   font-size: 22px;
   color: #4caf50;
   margin-bottom: 15px;
 }
 .email-content p {
   margin-bottom: 20px;
 }
 .email-content ul {
   padding: 0;
   list-style: none;
 }
 .email-content ul li {
   margin-bottom: 12px;
   display: flex;
   align-items: center;
 }
 .email-content ul li img {
   margin-right: 10px;
   width: 24px;
   height: 24px;
 }
 .email-content ul li span {
   font-weight: bold;
   color: #4caf50;
 }
 /* Footer Styles */
 .email-footer {
   text-align: center;
   padding: 20px;
   background-color: #f3f4f6;
   font-size: 14px;
   color: #555;
 }
 .email-footer p {
   margin-bottom: 15px;
 }
 .social-icons {
   display: flex;
   justify-content: center;
   gap: 12px;
   margin-bottom: 10px;
 }
 .social-icons a {
   display: inline-block;
   width: 32px;
   height: 32px;
 }
 .social-icons img {
   width: 100%;
   border-radius: 50%;
   transition: transform 0.2s ease;
 }
 .social-icons img:hover {
   transform: scale(1.1);
 }
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
    from: 'gaancash.oficial@gmail.com',
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
