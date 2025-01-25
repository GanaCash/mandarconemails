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
