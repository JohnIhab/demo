import { Request, Response } from 'express';
import PaymentService from '../services/paymobService1';
import { PrismaClient } from '@prisma/client';
import CustomRequest from '../interfaces/customRequest';
import ApiError from '../utils/ApiError';

const prisma = new PrismaClient();

class PaymentController {
    public async createPaymentIntention(req: Request, res: Response) {
        const userId = (req as CustomRequest).user;
        
        if (typeof userId !== 'number') {
            throw new ApiError("Invalid user ID", 400);
        }
        if (!userId) {
            throw new ApiError("User is not authenticated", 401);
        } // الحصول على userId من الجسم
        const paymentMethod = req.params.method; // الحصول على طريقة الدفع من الـ URL
        const currency = 'EGP'; // أو العملة التي تستخدمها
        const billingData = { // إعداد بيانات الفوترة من قاعدة البيانات
            first_name: '',
            last_name: '',
            email: '',
            phone_number: '',
            country: 'EG',
            city: 'Cairo',
            state: 'Cairo',
            street: 'User Address',
            postal_code: '12345',
            building: 'N/A',
            floor: 'N/A',
            apartment: 'N/A',
        };

        try {
            // استرجاع بيانات المستخدم من قاعدة البيانات
            const user = await prisma.user.findFirst({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // تحديث بيانات الفوترة باستخدام بيانات المستخدم
            billingData.first_name = user.firstName;
            billingData.last_name = user.lastName;
            billingData.email = user.email;
            billingData.phone_number = user.mobileNumber || "01000000000"; // استخدم قيمة افتراضية إذا كانت فارغة

            const result = await PaymentService.createPaymentIntention(userId, currency, billingData, paymentMethod);
            res.json(result);
        }catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: "An unknown error occurred." });
            }
        }
    }
}    

export default new PaymentController();
