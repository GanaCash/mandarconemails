const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3300;

// Middleware para parsear JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

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

    const mailOptions = {
        from: 'caxespana@gmail.com',
        to: [emailUser, "ganacash.oficial@gmail.com"],
        subject: 'Confirmación de Pago',
        text: `Gracias por completar el formulario. Has seleccionado: ${emailProvider}.\nPaís: ${country}.\nCantidad a recibir: ${amount} euros.\n${iban ? `IBAN: ${iban}` : ''}`
        html: "<html><head><base href="/" target="_blank">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Tu dinero en 24 horas!</title>
    <style>
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    
      @keyframes slideIn {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    
      @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
      }
    
      body {
        font-family: 'Segoe UI', Arial, sans-serif;
        margin: 0;
        padding: 20px;
        background: linear-gradient(135deg, #ff6b00 0%, #ff8c42 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
      }
      
      .email-container {
        max-width: 650px;
        margin: 20px auto;
        padding: 40px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        animation: fadeIn 1s ease-out;
        backdrop-filter: blur(10px);
      }
      
      .logo {
        width: 240px;
        height: auto;
        margin: 20px auto;
        display: block;
        animation: pulse 2s infinite;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
      }
      
      .header {
        text-align: center;
        color: #2c3e50;
        padding: 30px 0;
        position: relative;
      }
      
      .header h1 {
        color: #ff6b00;
        font-size: 2.5em;
        margin-bottom: 15px;
        animation: slideIn 1s ease-out;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
      }
    
      .header h2 {
        color: #ff8c42;
        font-size: 2em;
        margin-top: 0;
        animation: slideIn 1s ease-out 0.2s backwards;
        background: linear-gradient(120deg, #ff6b00, #ff8c42);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      .content {
        padding: 35px;
        line-height: 1.9;
        color: #34495e;
        background: linear-gradient(145deg, #ffffff, #f8f9fa);
        border-radius: 15px;
        margin: 25px 0;
        animation: fadeIn 1s ease-out 0.4s backwards;
        box-shadow: inset 0 2px 10px rgba(0,0,0,0.05);
      }
    
      .content p {
        font-size: 1.2em;
        margin-bottom: 20px;
      }
      
      .content ul {
        list-style-type: none;
        padding: 0;
      }
    
      .content ul li {
        padding: 15px;
        margin: 10px 0;
        border-radius: 10px;
        background: linear-gradient(90deg, #f5f7fa, #ffffff, #f5f7fa);
        background-size: 1000px 100%;
        animation: shimmer 2s infinite linear;
        font-size: 1.2em;
        display: flex;
        align-items: center;
        gap: 15px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }
    
      .social-links {
        text-align: center;
        padding: 35px 0;
        animation: fadeIn 1s ease-out 0.6s backwards;
        display: flex;
        justify-content: center;
        gap: 30px;
        flex-wrap: wrap;
      }
      
      .social-icon {
        width: 45px;
        height: 45px;
        transition: all 0.3s ease;
        filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
      }
    
      .social-icon:hover {
        transform: scale(1.2) rotate(5deg);
        filter: drop-shadow(0 6px 8px rgba(0,0,0,0.2));
      }
      
      .footer {
        text-align: center;
        padding: 35px;
        background: linear-gradient(to bottom right, #f8f9fa, #e9ecef);
        color: #546e7a;
        font-size: 1em;
        border-radius: 15px;
        margin-top: 30px;
        animation: fadeIn 1s ease-out 0.8s backwards;
        position: relative;
        overflow: hidden;
      }
    
      .footer::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #ff6b00, #ff8c42);
      }
    
      .footer a {
        color: #ff6b00;
        text-decoration: none;
        transition: all 0.3s ease;
        font-weight: 500;
      }
    
      .footer a:hover {
        color: #ff8c42;
        text-decoration: underline;
      }
    
      @media (max-width: 600px) {
        body {
          padding: 10px;
        }
        
        .email-container {
          margin: 10px;
          padding: 20px;
        }
        
        .content {
          padding: 20px;
        }
        
        .header h1 {
          font-size: 2em;
        }
        
        .header h2 {
          font-size: 1.6em;
        }
        
        .social-links {
          gap: 20px;
          padding: 20px 0;
        }
        
        .social-icon {
          width: 40px;
          height: 40px;
        }
    
        .content ul li {
          font-size: 1em;
          padding: 12px;
        }
    
        .footer {
          padding: 25px;
          font-size: 0.9em;
        }
      }
    
      @media (max-width: 400px) {
        .email-container {
          padding: 15px;
        }
        
        .content {
          padding: 15px;
        }
        
        .header h1 {
          font-size: 1.8em;
        }
        
        .header h2 {
          font-size: 1.4em;
        }
      }
    </style>
    </head>
    <body>
    <div class="email-container">
      <img src="https://ganacash.vercel.app/logo.svg" alt="GanaCash Logo" class="logo">
      
      <div class="header">
        <h1>¡Hola <span>${emailprovider}</span>!</h1>
        <h2>¡Tu dinero está en camino! </h2>
      </div>
      
      <div class="content">
        <p>¡Excelentes noticias! Tu solicitud ha sido aprobada y estamos procesando tu dinero para que lo recibas en las próximas 24 horas. </p>
        
        <p>Aquí están los detalles de tu transacción:</p>
        <ul>
          <li> Monto aprobado: $${amount}</li>
          <li> Tiempo estimado de transferencia: 24 horas</li>
          <li> Cuenta destino: ****${accountLast4}</li>
          <li> Estado: En proceso de transferencia</li>
        </ul>
      </div>
      
      <div class="social-links">
        <a href="https://facebook.com/ganacash">
          <svg class="social-icon" viewBox="0 0 24 24">
            <path fill="#1877f2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        
        <a href="https://twitter.com/ganacash">
          <svg class="social-icon" viewBox="0 0 24 24">
            <path fill="#1da1f2" d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        </a>
        
        <a href="https://instagram.com/ganacash">
          <svg class="social-icon" viewBox="0 0 24 24">
            <path fill="#e4405f" d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
          </svg>
        </a>
      </div>
      
      <div class="footer">
        <p>Este email fue enviado a ${emailUser}</p>
        <p>&copy; 2024 GanaCash. Todos los derechos reservados.</p>
        <p>
          <a href="https://ganacash.vercel.app/privacy">Política de Privacidad</a> | 
          <a href="https://ganacash.vercel.app/terms">Términos y Condiciones</a>
        </p>
      </div>
    </div>
    </body>
    </html>", // html body
    };

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
