/*import express, { Request, Response } from 'express';
import axios from 'axios';
import cartService from '../services/cartService';

const app = express();
app.use(express.json());

app.post('/create-payment', async (req: Request, res: Response) => {
    const { userId } = req.body;

    try {
       // حساب إجمالي السعر من الفيديوهات المختارة فقط في العربة
        const totalPrice = await cartService.calculateTotalPrice(userId);

        // إنشاء عملية الدفع عبر فوري
        const paymentResponse = await createFawryPayment(userId, totalPrice, "Payment for selected courses");

        // تخزين الفيديوهات المدفوعة فقط في العربة
        await cartService.lockPurchasedItems(userId);

        const fawryRefNumber = paymentResponse.fawryRefNumber;

        res.status(200).json({
            success: true,
            fawryRefNumber: fawryRefNumber,
            message: 'استخدم رقم المرجع هذا لدفع ثمن الكورسات في أي ماكينة فوري.',
        });
    } catch (error) {
        let errorMessage = 'حدث خطأ غير معروف.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        res.status(500).json({
            success: false,
            message: 'فشل في إنشاء الدفع عبر فوري.',
            error: errorMessage,
        });
    }
});

async function createFawryPayment(userId: string, amount: number, description: string) {
    const merchantCode = process.env.FAWRY_MERCHANT_CODE;
    const secureKey = process.env.FAWRY_SECURE_KEY;
    const endpoint = 'https://www.atfawry.com/ECommerceWeb/Fawry/payments/charge';

    const paymentData = {
        merchantCode: merchantCode,
        merchantRefNumber: `order-${userId}-${Date.now()}`,
        customerProfileId: userId,
        paymentMethod: 'PAYATFAWRY',
        amount: amount,
        currencyCode: 'EGP',
        description: description,
        paymentExpiry: '168',
        chargeItems: [
            {
                itemId: '1',
                description: description,
                price: amount,
                quantity: 1,
            }
        ],
        signature: '', // Signature to be calculated
    };

    const signatureString = `${merchantCode}${paymentData.merchantRefNumber}${userId}${paymentData.paymentMethod}${amount}${secureKey}`;
    paymentData.signature = generateSignature(signatureString);

    try {
        const response = await axios.post(endpoint, paymentData);
        return response.data;
    } catch (error) {
        console.error('Error creating Fawry payment:', error);
        throw error;
    }
}

function generateSignature(data: string) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(data).digest('hex');
}


*/