const express = require('express');
const router = express.Router();
const {
  createPendingRegistration,
  getAllStudents,
  initiatePayment,
  verifyPayment,
  webhookHandler,
} = require('../controllers/student');

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a student and create a pending payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Pending registration created
 */
router.post('/register', createPendingRegistration);

/**
 * @swagger
 * /api/make-payment:
 *   post:
 *     summary: Initiate payment using Flutterwave
 *     responses:
 *       200:
 *         description: Redirect URL for payment returned
 */
router.post('/make-payment', initiatePayment);

/**
 * @swagger
 * /api/payment/webhook:
 *   post:
 *     summary: Handle webhook callback from Flutterwave
 *     responses:
 *       200:
 *         description: Webhook received and processed
 */
router.post('/payment/webhook', webhookHandler);

/**
 * @swagger
 * /api/payment/verify:
 *   get:
 *     summary: Verify payment with Flutterwave
 *     parameters:
 *       - in: query
 *         name: tx_ref
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction reference
 *     responses:
 *       200:
 *         description: Payment verified successfully
 */
router.get('/payment/verify', verifyPayment);

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get list of registered students
 *     responses:
 *       200:
 *         description: List of students
 */
router.get('/students', getAllStudents);

module.exports = router;
