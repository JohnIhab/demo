"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paymobService_1 = __importDefault(require("../services/paymobService"));
class PaymentController {
    async initiatePayment(req, res) {
        const { userId, totalPrice, paymentMethod } = req.body;
        try {
            const paymentResponse = await paymobService_1.default.initiatePayment(userId, totalPrice, paymentMethod);
            res.status(200).json(paymentResponse);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Something went wrong' });
            }
        }
    }
    async handleWebhook(req, res) {
        try {
            // await PaymentService.handlePaymobWebhook(webhok);
            res.status(200).send('Webhook received');
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Something went wrong' });
            }
        }
    }
}
exports.default = new PaymentController();
//# sourceMappingURL=paymob.js.map