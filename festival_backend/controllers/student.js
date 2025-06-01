const { default: axios } = require('axios');
const { FestivalStudent, PendingPayment } = require('../model/model.js');
const { generateQRCode, sendEmail, validateClientData } = require('../utils.js');
const { isValidPhoneNumber } = require('libphonenumber-js');
const _ = require('lodash');

const createPendingRegistration = async (req, res) => {
    try {
        const { ...registrationData } = req.body;

        // Validate client data
        const clientData = validateClientData(req.body);
        const same = _.isEqual(clientData, registrationData);
        if (!same) {
            return res.status(400).json({ message: 'Invalid data' });
        }

        // Validate phone number
        if (!isValidPhoneNumber(registrationData.phoneNumber, 'NG')) {
            return res.status(400).json({ message: 'Invalid phone number' });
        }

        // Validate phone number
        if (!isValidPhoneNumber(registrationData.ParentGuardianNumber, 'NG')) {
            return res.status(400).json({ message: 'Invalid phone number' });
        }

        // Check if the email already exists
        const existingStudent = await PendingPayment.findOne({ email: registrationData.email });
        if (existingStudent) {
            const now = new Date()
            const create = new Date(existingStudent.createdAt);
            const ageDiff = (now - create) / (1000 * 60); 

            if (existingStudent.status === 'successful') {
                return res.status(400).json({ message: 'Email already registered and paid' });
            } else if (ageDiff <= 5) {
                return res.status(400).json({ message: 'A pending registration already exists. Please wait or retry in a few minutes.' });
            } else {
                await PendingPayment.findByIdAndDelete(existingStudent._id); // Delete old pending payment if it is older than 5 minutes
            }
        }

        tx_ref = `tx_${Date.now()}-${Math.floor(Math.random() * 100000)}`;
        // Create a new pending payment
        await PendingPayment.create({
            tx_ref,
            ...registrationData,
            status: 'pending',
        })

       return res.status(200).json({
        message: 'pending payment created successfully',
        tx_ref,
        redirectTo: `${process.env.BASE_URL}/api/make-payment?tx_ref=${tx_ref}`
       })

    } catch (error) {
        console.error('Error creating pending user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const initiatePayment = async (req, res) => {
    try {
        const { tx_ref } = req.query;
        const { amount } = req.body;

        // Validate the amount
        if (!amount || amount < 1020) {
            return res.status(400).json({ message: 'Invalid amount' });
        }
        
        const pendingPayment = await PendingPayment.findOne({ tx_ref });
        if (!pendingPayment) {
            return res.status(404).json({ message: 'Pending payment not found' });
        }

        // Check if the payment is already successful
        if (pendingPayment.status === 'successful') {
            return res.status(400).json({ message: 'Payment already successful' });
        }

        // Update the pending payment with the amount
        pendingPayment.amount = amount;
        await pendingPayment.save();

        // Initiate the payment process here (e.g., using a payment gateway)
        const payload = {
            tx_ref,
            amount,
            currency: 'NGN',
            redirect_url: `https://jesusfestival2025.vercel.app/payment?tx_ref=${tx_ref}`,
            customer: {
                email: pendingPayment.email,
                name: pendingPayment.fullName,
            },
            customizations: {
                title: 'Jesus Festival',
                description: 'Payment for Jesus Festival Registration',
            },
        };

        const response = await axios.post(
            'https://api.flutterwave.com/v3/payments',
            payload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
                }
            }
        )

        if (response.data.status === 'success') {
            return res.status(200).json({
                message: 'Payment initiated successfully',
                paymentUrl: response.data.data.link,
            });
        } else {
            return res.status(400).json({ message: 'Failed to initiate payment' });
        }
    } catch (error) {
        console.error('Error initiating payment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


const verifyPayment = async (req, res) => {
    try {
        const { tx_ref, transaction_id } = req.query;
        const pendingPayment = await PendingPayment.findOne({ tx_ref });
        if (!pendingPayment) {
            return res.status(404).json({ message: 'Pending payment not found' });
        }

        // Verify the payment with the payment gateway
        const response = await axios.get(
            'https://api.flutterwave.com/v3/transactions/' + transaction_id + '/verify',
            {
                headers: {
                    Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
                }
            }
        )

        if (response.data.status === 'success') {
            // Update the pending payment status to successful
            pendingPayment.status = 'successful';
            pendingPayment.usedForRegistration = true;
            await pendingPayment.save();
            
            // Create a new student record
            const studentData = validateClientData(pendingPayment.toObject());

            // generate QR code
            const qrCode = await generateQRCode(studentData.fullName, studentData.email);
            const { qrCodeImageUrl, registerationId } = qrCode;

            const newStudent = new FestivalStudent({
                ...studentData,
                registerationId,
            });

            await newStudent.save();
    

            // Send email
            await sendEmail(
                newStudent.email,
                newStudent.fullName,
                qrCodeImageUrl,
                registerationId
            );
            return res.status(200).json({
                message: 'Payment verified successfully',
                student: {
                    id: newStudent._id,
                    fullName: newStudent.fullName,
                    email: newStudent.email,
                    registrationId: newStudent.registrationId,
                },
            });
        } else {
            return res.status(400).json({ message: 'Payment verification failed' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const webhookHandler = async (req, res) => {
    try {
        const hash = req.headers['verif-hash']
        const secretHash = process.env.FLW_HASH_SECRET

        // Validate Flutterwave webhook hash
        if (!hash || hash != secretHash) {
            return res.status(403).json({ message: 'Invalid signature' });
        }

        const payload = req.body;

        if (payload.event === 'charge.completed') {
            const { tx_ref, status } = payload.data;

            // Only process successful payments
            if (status === 'successful') {
                const pendingPayment = await PendingPayment.findOne({ tx_ref })
                if (!pendingPayment) {
                    console.log('Pending payment not found for tx_ref:', tx_ref);
                    return res.status(404).json({ message: 'Pending payment not found' });
                }

                const isRegistered = await FestivalStudent.findOne({ email: pendingPayment.email })

                if (pendingPayment.status !== 'successful' && !isRegistered) {
                    // Update the pending payment status to successful
                    pendingPayment.status = 'successful';
                    pendingPayment.usedForRegistration = true;
                    await pendingPayment.save();

                    // Create a new student record
                    const studentData = validateClientData(pendingPayment.toObject());

                    // generate QR code
                    const qrCode = await generateQRCode(studentData.fullName, studentData.email);
                    const { qrCodeImageUrl, registerationId } = qrCode;

                    const newStudent = new FestivalStudent({
                        ...studentData,
                        registerationId
                    });

                    try {
                        await newStudent.save();
                    } catch(error) {
                        if (error === 11000) {
                            console.warn("Duplicate student detected:', pendingPayment.email");
                        }else {
                            console.error('Error saving new student:', error);
                            return res.status(500).json({ message: 'Internal server error' });
                        }
                    }

                    // Send email
                    await sendEmail(
                        newStudent.email,
                        newStudent.fullName,
                        qrCodeImageUrl, 
                        registerationId
                    );
                }
            }
        }
        return res.status(200).json({ message: 'Webhook processed successfully' });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


const getAllStudents = async (req, res) => {
    try {
        const students = await FestivalStudent.find().sort({ createdAt: -1});
        return res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    createPendingRegistration,
    initiatePayment,
    verifyPayment,
    getAllStudents,
    webhookHandler
}