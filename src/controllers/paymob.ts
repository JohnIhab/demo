import { Request, Response } from 'express';
import PaymentService from '../services/paymobService';

class PaymentController {
    async initiatePayment(req: Request, res: Response) {
        const { userId, totalPrice, paymentMethod } = req.body;

        try {
            const paymentResponse = await PaymentService.initiatePayment(userId, totalPrice, paymentMethod);
            res.status(200).json(paymentResponse);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Something went wrong' });
            }
        }
    }

    async handleWebhook(req: Request, res: Response) {
        try {
           // await PaymentService.handlePaymobWebhook(webhok);
            res.status(200).send('Webhook received');
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Something went wrong' });
            }
        }
    }
}

export default new PaymentController();
