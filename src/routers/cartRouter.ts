import { Router } from 'express';
import cartController from '../controllers/cartController';
import { authenticate } from '../middlewares/authenticate';
import PaymentController from '../controllers/paymob';
import auth from "../middlewares/auth";
const router = Router();


router.get('/card',auth ,cartController.getCart);









router.post('/initiate-payment', PaymentController.initiatePayment);
router.post('/webhook', PaymentController.handleWebhook);









export default router;
