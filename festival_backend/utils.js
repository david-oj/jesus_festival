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
        <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
            <h2 style="color: #2c3e50; text-align: center;">🎉 Jesus Festival Registration Confirmed!</h2>
            <p style="font-size: 16px; color: #333;">Dear <strong>${name}</strong>,</p>
            <p style="font-size: 16px; color: #333;">Thank you for registering for the <strong>Jesus Festival</strong>! Your registration has been successfully confirmed.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <img src="cid:qr_code" alt="QR Code" style="width: 200px; height: auto;" />
                <p style="font-size: 14px; color: #333;">Scan this QR code at the event entrance</p>
            </div>

            <p style="font-size: 16px; color: #333;">Your <strong>Registration ID</strong>: <span style="background: #eaeaea; padding: 5px 10px; border-radius: 4px; font-weight: bold;">${registerationId}</span></p>

            <p style="font-size: 16px; color: #333;">We can't wait to welcome you at the festival. Stay blessed!</p>
            <p style="font-size: 16px; color: #333;">Warm regards,<br><strong>Jesus Festival Team</strong></p>

            <hr style="margin-top: 30px;" />
            <p style="font-size: 12px; color: #999; text-align: center;">This email was sent to ${email}. Please keep this email for your records.</p>
        </div>
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
        'address',
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