const express = require('express');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
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

  // Generar un código de transacción aleatorio
  const transaction_id = 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();

  // Crear el PDF
  const pdfDoc = new PDFDocument();
  const pdfPath = path.join(__dirname, 'transaccion.pdf');
  const writeStream = fs.createWriteStream(pdfPath);
  pdfDoc.pipe(writeStream);

  pdfDoc.fontSize(16).text('¡Tu Dinero Está en Camino!', { align: 'center' });
  pdfDoc.moveDown();
  pdfDoc.fontSize(12).text(`¡Hola ${emailUser}!`, { continued: true });
  pdfDoc.text('¡Excelentes noticias! Tu solicitud ha sido aprobada y estamos procesando tu dinero para que lo recibas en las próximas 24 horas.');
  pdfDoc.moveDown();
  pdfDoc.text('Detalles de tu transacción:', { continued: true });
  pdfDoc.text(`Cantidad aprobada: ${amount} euros`);
  pdfDoc.text(`Tiempo estimado de transferencia: 24 horas`);
  pdfDoc.text(`Has seleccionado: ${emailProvider}`);
  if (iban) {
    pdfDoc.text(`IBAN: ${iban}`);
  }
  pdfDoc.text(`Email: ${emailUser}`);
  pdfDoc.text(`ID de Transacción: ${transaction_id}`);

  pdfDoc.end();

  writeStream.on('finish', () => {
    // Plantilla HTML del correo
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email con PDF Adjunto</title>
        <style>
          /* Estilos CSS */
          body { font-family: Arial, sans-serif; background-color: #f9fafb; color: #333; }
          .email-container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
          .email-header { background: linear-gradient(to right, #007BFF, #0056b3); color: white; text-align: center; padding: 40px 20px; }
          .email-header img { max-width: 150px; margin-bottom: 15px; }
          .email-header h2 { font-size: 28px; margin: 10px 0; line-height: 1.4; }
          .email-content { padding: 20px; line-height: 1.8; font-size: 16px; }
          .email-content h1 { font-size: 22px; color: #4caf50; margin-bottom: 15px; }
          .email-content p { margin-bottom: 20px; }
          .email-content ul { padding: 0; list-style: none; }
          .email-content ul li { margin-bottom: 12px; display: flex; align-items: center; }
          .email-content ul li img { margin-right: 10px; width: 24px; height: 24px; }
          .email-content ul li span { font-weight: bold; color: #4caf50; }
          .email-footer { text-align: center; padding: 20px; background-color: #f3f4f6; font-size: 14px; color: #555; }
          .email-footer p { margin-bottom: 15px; }
          .social-icons { display: flex; justify-content: center; gap: 12px; margin-bottom: 10px; }
          .social-icons a { display: inline-block; width: 32px; height: 32px; }
          .social-icons img { width: 100%; border-radius: 50%; transition: transform 0.2s ease; }
          .social-icons img:hover { transform: scale(1.1); }
          a { text-decoration: none; color: #333; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <img src="https://ganacash.vercel.app/Fondo.png" alt="GanaCash Logo">
            <h2>¡Tu Dinero Está en Camino!</h2>
          </div>
          <div class="email-content">
            <h1>¡Hola ${emailUser}!</h1>
            <p>¡Excelentes noticias! Tu solicitud ha sido aprobada y estamos procesando tu dinero para que lo recibas en las próximas 24 horas.</p>
            <h2>Detalles de tu transacción:</h2>
            <ul>
              <li><img src="https://ganacash.vercel.app/imagenes/dinero.png" alt="Icono Monto"> Cantidad aprobada: <span>${amount} euros</span></li>
              <li><img src="https://ganacash.vercel.app/imagenes/Tiempo.png" alt="Icono Tiempo"> Tiempo estimado de transferencia: <span>24 horas</span></li>
              <li><img src="https://ganacash.vercel.app/imagenes/elegir.png" alt="Icono Elegir"> Has seleccionado: <span>${emailProvider}</span></li>
              ${iban ? `<li><img src="https://ganacash.vercel.app/imagenes/iban.png" alt="Icono IBAN"> IBAN: <span>${iban}</span></li>` : ''}
              <li><img src="https://ganacash.vercel.app/imagenes/email.png" alt="Icono Email"> Email: <span>${emailUser}</span></li>
            </ul>
          </div>
          <div class="email-footer">
            <p>© 2025 GanaCash. Todos los derechos reservados.</p>
            <p>Este email fue enviado de manera automática a ${emailUser}</p>
            <div class="social-icons">
              <a href="https://facebook.com" target="_blank"><img src="https://via.placeholder.com/32/09f/fff.png?text=F" alt="Facebook"></a>
              <a href="https://twitter.com" target="_blank"><img src="https://via.placeholder.com/32/00aced/fff.png?text=T" alt="Twitter"></a>
              <a href="https://instagram.com" target="_blank"><img src="https://via.placeholder.com/32/e1306c/fff.png?text=I" alt="Instagram"></a>
            </div>
            <a href="mailto:ganacash.app.oficial@gmail.com">Contáctanos | </a><a href="mailto:ganacash.app.oficial@gmail.com">¿No eres tú?</a>
          </div>
        </div>
      </body>
      </html>
    `;

    // Configuración del correo
    const mailOptions = {
      from: 'ganacash.oficial@gmail.com',
      to: emailUser,
      subject: 'Confirmación de Pago',
      html: emailHtml,
      attachments: [
        {
          filename: 'transaccion.pdf',
          path: pdfPath
        }
      ]
    };

    // Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo:', error);
        return res.status(500).json({ success: false, message: 'Error al enviar el correo' });
      }
      res.json({ success: true, message: 'Correo enviado con éxito' });
    });
  });

  writeStream.on('error', (err) => {
    console.error('Error al escribir el PDF:', err);
    res.status(500).json({ success: false, message: 'Error al generar el PDF' });
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
