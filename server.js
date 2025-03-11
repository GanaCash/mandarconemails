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
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
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
    background: linear-gradient(to right, #007BFF, #0056b3);
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

a {
  text-decoration: none;
  color: #333
}
    .pdf-container {
      text-align: center;
      margin-top: 20px;
    }
    .download-button {
      display: inline-block;
      padding: 10px 20px;
      font-size: 1em;
      color: #fff;
      background-color: #007BFF;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      text-decoration: none;
    }
    .download-button:hover {
      background-color: #0056b3;
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
      <h1>¡Hola <span id="emailUser">emailuser</span>!</h1>
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
          Has seleccionado: <span id="emailProvider">${emailProvider}</span>
        </li>
        ${iban ? `<li>IBAN: <span>${iban}</span></li>` : ''}
        <li>
          <img src="https://ganacash.vercel.app/imagenes/email.png" alt="Icono Email">
          Email: <span id="emailUserCopy">${emailUser}</span>
        </li>
      </ul>
       <!-- PDF Section -->
  <div class="pdf-container">
    <a id="downloadLink" class="download-button">Más detalles</a>
  </div>
    </div>
    

    <!-- Footer Section -->
    <div class="email-footer">
      <p>© 2025 GanaCash. Todos los derechos reservados.</p>
      <p>Este email fue enviado de manera automática a <span id="emailUserFooter">${emailUser}</span></p>
      <a href="mailto:ganacash.app.oficial@gmail.com">Contáctanos | </a><a href="mailto:ganacash.app.oficial@gmail.com">¿No eres tú?</a>
    </div>
  </div>

 

  <script>
   
    // Generar un código de transacción aleatorio
    const transaction_id = 'C' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Actualizar el contenido del HTML con los datos
    document.getElementById('emailUser').textContent = emailUser;
    document.getElementById('emailProvider').textContent = emailProvider;
    document.getElementById('emailUserCopy').textContent = emailUser;
    document.getElementById('emailUserFooter').textContent = emailUser;

    if (iban) {
      document.getElementById('iban').textContent = iban;
      document.getElementById('iban-li').style.display = 'list-item';
    }

    // Crear el PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");

    // Añadir el logo
    const logoImage = new Image();
    logoImage.src = 'https://ganacash.vercel.app/Fondo.png';
    doc.addImage(logoImage, 'PNG', 10, 8, 30, 30);

    // Añadir el contenido con colores y estilo
    doc.setTextColor(50, 50, 50);
    doc.text("¡Tu Dinero Está en Camino!", 10, 50);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`¡Hola ${emailUser}!`, 10, 60);
    doc.text("¡Excelentes noticias! Tu solicitud ha sido aprobada y estamos procesando tu dinero", 10, 70);
    doc.text("para que lo recibas en las próximas 24 horas", 10, 80);
    doc.setTextColor(50, 50, 50);
    doc.text("Detalles de tu transacción:", 10, 90);
    doc.setTextColor(100, 100, 100);
    doc.text(`Cantidad aprobada: 1 euro`, 10, 100);
    doc.text(`Tiempo estimado de transferencia: 24 horas`, 10, 110);
    doc.text(`Has seleccionado: ${emailProvider}`, 10, 120);
    if (iban) {
      doc.text(`IBAN: ${iban}`, 10, 130);
    }
    doc.text(`Email: ${emailUser}`, 10, 140);
    doc.setTextColor(0, 0, 255);
    doc.text(`ID de Transacción: ${transaction_id}`, 10, 150);

    // Añadir una línea decorativa
    doc.setDrawColor(200, 200, 200);
    doc.line(10, 145, 200, 145);

    // Crear un enlace de descarga
    const pdfDataUri = doc.output('datauristring');
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = pdfDataUri;
    downloadLink.download = 'GanaCash.pdf';
  </script>
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
