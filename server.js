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
  const emailHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email con PDF Adjunto</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .email-header, .email-footer {
      text-align: center;
    }
    .email-header img {
      max-width: 150px;
    }
    .email-content h1 {
      color: #333;
    }
    .email-content ul {
      list-style-type: none;
      padding: 0;
    }
    .email-content ul li {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .email-content ul li img {
      margin-right: 10px;
      max-width: 24px;
    }
    .email-footer p {
      font-size: 0.9em;
      color: #777;
    }
    #download-pdf {
      display: block;
      margin: 20px auto;
      padding: 10px 20px;
      background-color: #007BFF;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    #download-pdf:hover {
      background-color: #0056b3;
    }

    a {
  text-decoration: none;
  color: #333
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
      <h1>¡Hola <span id="emailUser">Usuario</span>!</h1>
      <p>¡Excelentes noticias! Tu solicitud ha sido aprobada y estamos procesando tu dinero para que lo recibas en las próximas 24 horas.</p>
      <h2>Detalles de tu transacción:</h2>
      <ul>
        <li>
          <img src="https://ganacash.vercel.app/imagenes/dinero.png" alt="Icono Monto">
          Cantidad aprobada: <span>1 euro</span>
        </li>
        <li>
          <img src="https://ganacash.vercel.app/imagenes/Tiempo.png" alt="Icono Tiempo">
          Tiempo estimado de transferencia: <span>24 horas</span>
        </li>
        <li>
          <img src="https://ganacash.vercel.app/imagenes/elegir.png" alt="Icono Elegir">
          Has seleccionado: <span id="emailProvider">${emailProvider} </span>
        </li>
        <li id="iban-li" style="display: none;">
            ${iban ? `<li>IBAN: <span id = "iban">${iban}</span></li>` : ''} 
        </li>
        <li>
          <img src="https://ganacash.vercel.app/imagenes/email.png" alt="Icono Email">
          Email: <span id="emailUserCopy">${emailUser}</span>
        </li>
      </ul>
      <button id="download-pdf">Más detalles</button>
    </div>

    <!-- Footer Section -->
    <div class="email-footer">
      <p>© 2025 GanaCash. Todos los derechos reservados.</p>
      <p>Este email fue enviado de manera automática a <span id="emailUserFooter">${emailUser}</span></p>
      <a href="mailto:ganacash.app.oficial@gmail.com">Contáctanos | </a><a href="mailto:ganacash.app.oficial@gmail.com">¿No eres tú?</a>
    </div>
  </div>



  <script>
    

    // Llenar los datos en el HTML
    document.getElementById('emailUser').textContent = emailUser;
    document.getElementById('emailProvider').textContent = emailProvider;
    document.getElementById('emailUserCopy').textContent = emailUser;
    document.getElementById('emailUserFooter').textContent = emailUser;

    if (iban) {
      document.getElementById('iban').textContent = iban;
      document.getElementById('iban-li').style.display = 'flex';
    }

    document.getElementById('download-pdf').addEventListener('click', function () {
      // Capturar el contenido del email
      const emailContainer = document.querySelector('.email-container');

      // Usar html2canvas para convertir el contenido a una imagen
      html2canvas(emailContainer).then(canvas => {
        // Obtener la imagen como una URL de datos
        const imgData = canvas.toDataURL('image/png');

        // Crear un nuevo documento PDF
        const pdf = new jspdf.jsPDF();
        const imgWidth = 190; // Ajustar el ancho de la imagen en el PDF
        const pageHeight = 295; // Altura de la página del PDF
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 10; // Posición inicial en Y

        // Agregar la imagen al PDF
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position -= pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Generar un ID de transacción aleatorio
        const transactionId = 'C-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        // Agregar el ID de transacción al PDF
        pdf.text(`ID de Transacción: ${transactionId}`, 10, pdf.internal.pageSize.height - 10);

        // Descargar el PDF
        pdf.save('GanaCash.pdf');
      });
    });
  </script>
</body>
</html>

  `;

  // Configuración del correo
  const mailOptions = {
    from: 'ganacash.oficial@gmail.com',
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
