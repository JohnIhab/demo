"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paymobService1_1 = __importDefault(require("../services/paymobService1"));
const client_1 = require("@prisma/client");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const prisma = new client_1.PrismaClient();
class PaymentController {
    async createPaymentIntention(req, res) {
        const userId = req.user;
        if (typeof userId !== 'number') {
            throw new ApiError_1.default("Invalid user ID", 400);
        }
        if (!userId) {
            throw new ApiError_1.default("User is not authenticated", 401);
        } // الحصول على userId من الجسم
        const paymentMethod = req.params.method; // الحصول على طريقة الدفع من الـ URL
        const currency = 'EGP'; // أو العملة التي تستخدمها
        const billingData = {
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
            const result = await paymobService1_1.default.createPaymentIntention(userId, currency, billingData, paymentMethod);
            res.json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "An unknown error occurred." });
            }
        }
    }
}
exports.default = new PaymentController();
//# sourceMappingURL=paymobController.js.map