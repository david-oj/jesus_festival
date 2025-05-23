const QRCode = require('qrcode');
const nodemailer = require('nodemailer');
require('dotenv').config();


const generateQRCode = async (name, email) => {
    try {
        const registerationId = 'EVT-' + Math.floor(Math.random() * 1000000);
        const qrData = {name, email, registerationId};
        const qrCodeImageUrl = await QRCode.toDataURL(JSON.stringify(qrData),{
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.95,
            margin: 1,
            width: 300
        })
        return {qrCodeImageUrl, registerationId};
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code');
    }
}


const sendEmail = async (email, name, qrCodeImageUrl, registerationId) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    const mailOptions = {
        from: `Jesus Festival <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Jesus Festival Registration Confirmation',
        html: `
            <h1>Thank you for registering for the Jesus Festival!</h1>
            <p>Dear ${name},</p>
            <p>Your registration is confirmed. Please find your QR code below:</p>
            <img src="cid:qr_code" alt="QR Code" />
            <p>Your Registration ID: ${registerationId}</p>
            <p>We look forward to seeing you at the festival!</p>
        `,
        attachments: [
            {
                filename: 'qr_code.png',
                content: qrCodeImageUrl.split(';base64,').pop(),
                encoding: 'base64',
                cid: 'qr_code' // same cid value as in the html img src
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}

// validate client data
const validateClientData = (data) => {
    const allowedFields = [
        'fullName',
        'age',
        'gender',
        'phoneNumber',
        'email',
        'ParentGuardianNumber',
        'school',
        'christEmbassyChurch',
        'howDidYouHearAboutUs',
        'agreementFestivalEmailSms'
    ]
    const validatedData = {};

    allowedFields.forEach(field => {
        if (data[field]) {
            validatedData[field] = data[field];
        }
    });

    return validatedData;
}

const makePayment = async (data) => {
    { name, email}
}

module.exports = {
    generateQRCode,
    sendEmail,
    validateClientData
}