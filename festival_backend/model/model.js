const mongoose = require('mongoose');
const { Schema } = mongoose;


const jesusFestivalStudentSchema = new Schema({
    fullName: {type: String, required: true},
    age: {type: Number, required: true},
    gender: {type: String, enum: ['Male', 'Female'], required: true},
    phoneNumber: {type: String, required: true},
    email: {type: String, required: true},
    ParentGuardianNumber: {type: String, required: false},
    school: {type: String, required: true},
    address: {type: String, required: true},
    howDidYouHearAboutUs: {type: String, enum: ['School', 'WhatsApp', 'Church', 'Friend', 'Other'], required: true},
    agreementFestivalEmailSms: {type: Boolean, required: true},
}, {timestamps: true })

// pending payment schema
const pendingPaymentSchema = new Schema({
    tx_ref: { type: String, required: true },
    fullName: {type: String, required: true},
    age: {type: Number, required: true},
    gender: {type: String, enum: ['Male', 'Female'], required: true},
    phoneNumber: {type: String, required: true},
    email: {type: String, required: true},
    ParentGuardianNumber: {type: String, required: false},
    school: {type: String, required: true},
    address: {type: String, required: true},
    howDidYouHearAboutUs: {type: String, enum: ['Instagram', 'WhatsApp', 'Church', 'Friend', 'Other'], required: true},
    agreementFestivalEmailSms: {type: Boolean, required: true},
    amount: Number,
    status: { type: String, enum: ['pending', 'successful', 'failed'], default: 'pending' },
    usedForRegistration: { type: Boolean, default: false },
}, {timestamps: true })

const FestivalStudent = mongoose.model('FestivalStudent', jesusFestivalStudentSchema);
const PendingPayment = mongoose.model('PendingPayment', pendingPaymentSchema);

module.exports = {
    FestivalStudent,
    PendingPayment
}