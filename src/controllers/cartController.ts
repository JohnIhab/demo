import { Request, Response, NextFunction } from 'express';
import cartService from '../services/cartService';
import PaymentService from "../services/paymobService" // Make sure the import path is correct
import ApiError from '../utils/ApiError';
import response from '../utils/response';
import CustomRequest from "../interfaces/customRequest";

class CartController {
    async addToCart(req: Request, res: Response, next: NextFunction) {
        const userId = (req as CustomRequest).user;
        
        if (typeof userId !== 'number') {
            throw new ApiError("Invalid user ID", 400);
        }
        if (!userId) {
            throw new ApiError("User is not authenticated", 401);
        }

       
        const { lectureId } = req.params;

        // Convert lectureId to a number (since req.params is string by default)
        const lectureIdNumber = Number(lectureId);
        if (isNaN(lectureIdNumber)) {
            return next(new ApiError("Invalid lecture ID", 400));
        }

        
        try {
            const cart = await cartService.addLectureToCart(userId, lectureIdNumber);
            response(res, 200, { status: true, message: 'Item added to cart', data: cart });
        } catch (error) {
            next(error);
        }
    }

    async calculateTotalPrice(req: Request, res: Response, next: NextFunction) {
        const userId = (req as CustomRequest).user;
        if (typeof userId !== 'number') {
            throw new ApiError("Invalid user ID", 400);
        }
        if (!userId) {
            throw new ApiError("User is not authenticated", 401);
        }

        try {
            const totalPrice = await cartService.calculateTotalPrice(userId);
            response(res, 200, { status: true, message: 'Total price calculated', data: { totalPrice } });
        } catch (error) {
            next(error);
        }
    } 
    
    async getCart(req: Request, res: Response, next: NextFunction) {
        const userId = (req as CustomRequest).user;
        if (typeof userId !== 'number') {
            throw new ApiError("Invalid user ID", 400);
        }
        if (!userId) {
            throw new ApiError("User is not authenticated", 401);
        }
        console.log(userId);
        
        try {
            const totalPrice = await cartService.getCart(userId);
            response(res, 200, { status: true, message: 'the card', data: { totalPrice } });
        } catch (error) {
            next(error);
        }
    }


    async checkLectureAccess(req: Request, res: Response, next: NextFunction) {
        const userId = (req as CustomRequest).user;
        if (typeof userId !== 'number') {
            throw new ApiError("Invalid user ID", 400);
        }
        if (!userId) {
            throw new ApiError("User is not authenticated", 401);
        }

        try {
            const { lectureId } = req.body; // Update to lectureId
            await cartService.checkLectureAccess(userId, lectureId);
            response(res, 200, { status: true, message: 'Access to the lecture is still available.' });
        } catch (error) {
            next(error);
        }
    }

        async initiatePayment(req: Request, res: Response, next: NextFunction) {
            const userId = (req as CustomRequest).user;
            if (typeof userId !== 'number') {
                throw new ApiError("Invalid user ID", 400);
            }
            if (!userId) {
                throw new ApiError("User is not authenticated", 401);
            }
            const  paymentMethod  = req.params.paymentMethod as "visa" | "vodafone_cash";
            try {
                const totalPrice = await cartService.calculateTotalPrice(userId);
                const paymentResponse = await PaymentService.initiatePayment(userId, totalPrice, paymentMethod);
                response(res, 200, { status: true, message: 'paymentResponse', data:paymentResponse  });
            } catch (error) {
                next(error);
            }
        }
        async handlePaymobWebhook(req: Request, res: Response, next: NextFunction) {
            try {
                // استخراج البيانات من query parameters
                const paymentStatus = req.query.success;
                const paymentId = req.query.id as string;
                const userId = req.query.profile_id;
                console.log(paymentStatus);
                console.log(paymentId);
                 // تعديل أو تأكيد أن `profile_id` هو معرف المستخدم
                const paymentfirst = req.query.success;
                const paymentlast = req.query.success;
                // تحقق إذا كانت عملية الدفع ناجحة
                if (paymentStatus === 'true') {
                    // استدعاء الخدمة لتحديث حالة الدفع والسلة
                    await PaymentService.handlePaymobWebhook(paymentId, Number(userId));
                    console.log();
        
                    // إعادة استجابة "تم الدفع بنجاح"
                    return res.status(200).json({ message: 'تم الدفه بنجاح و المحاضره الان اصبحت متاحة' });
                } else {
                    // إذا لم تكن عملية الدفع ناجحة
                    return res.status(400).json({ message: 'فشل الدفع' });
                }
            } catch (error) {
                console.error('Error handling webhook:', error);
                return res.status(500).json({ message: 'حدث خطأ أثناء عمليه الدفع' });
            }
        }





}

const cartController = new CartController();
export default cartController;
