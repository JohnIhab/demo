"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cartService_1 = __importDefault(require("../services/cartService"));
const paymobService_1 = __importDefault(require("../services/paymobService")); // Make sure the import path is correct
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const response_1 = __importDefault(require("../utils/response"));
class CartController {
    async addToCart(req, res, next) {
        const userId = req.user;
        if (typeof userId !== 'number') {
            throw new ApiError_1.default("Invalid user ID", 400);
        }
        if (!userId) {
            throw new ApiError_1.default("User is not authenticated", 401);
        }
        const { lectureId } = req.params;
        // Convert lectureId to a number (since req.params is string by default)
        const lectureIdNumber = Number(lectureId);
        if (isNaN(lectureIdNumber)) {
            return next(new ApiError_1.default("Invalid lecture ID", 400));
        }
        try {
            const cart = await cartService_1.default.addLectureToCart(userId, lectureIdNumber);
            (0, response_1.default)(res, 200, { status: true, message: 'Item added to cart', data: cart });
        }
        catch (error) {
            next(error);
        }
    }
    async calculateTotalPrice(req, res, next) {
        const userId = req.user;
        if (typeof userId !== 'number') {
            throw new ApiError_1.default("Invalid user ID", 400);
        }
        if (!userId) {
            throw new ApiError_1.default("User is not authenticated", 401);
        }
        try {
            const totalPrice = await cartService_1.default.calculateTotalPrice(userId);
            (0, response_1.default)(res, 200, { status: true, message: 'Total price calculated', data: { totalPrice } });
        }
        catch (error) {
            next(error);
        }
    }
    async getCart(req, res, next) {
        const userId = req.user;
        if (typeof userId !== 'number') {
            throw new ApiError_1.default("Invalid user ID", 400);
        }
        if (!userId) {
            throw new ApiError_1.default("User is not authenticated", 401);
        }
        console.log(userId);
        try {
            const totalPrice = await cartService_1.default.getCart(userId);
            (0, response_1.default)(res, 200, { status: true, message: 'the card', data: { totalPrice } });
        }
        catch (error) {
            next(error);
        }
    }
    async checkLectureAccess(req, res, next) {
        const userId = req.user;
        if (typeof userId !== 'number') {
            throw new ApiError_1.default("Invalid user ID", 400);
        }
        if (!userId) {
            throw new ApiError_1.default("User is not authenticated", 401);
        }
        try {
            const { lectureId } = req.body; // Update to lectureId
            await cartService_1.default.checkLectureAccess(userId, lectureId);
            (0, response_1.default)(res, 200, { status: true, message: 'Access to the lecture is still available.' });
        }
        catch (error) {
            next(error);
        }
    }
    async initiatePayment(req, res, next) {
        const userId = req.user;
        if (typeof userId !== 'number') {
            throw new ApiError_1.default("Invalid user ID", 400);
        }
        if (!userId) {
            throw new ApiError_1.default("User is not authenticated", 401);
        }
        const paymentMethod = req.params.paymentMethod;
        try {
            const totalPrice = await cartService_1.default.calculateTotalPrice(userId);
            const paymentResponse = await paymobService_1.default.initiatePayment(userId, totalPrice, paymentMethod);
            (0, response_1.default)(res, 200, { status: true, message: 'paymentResponse', data: paymentResponse });
        }
        catch (error) {
            next(error);
        }
    }
    async handlePaymobWebhook(req, res, next) {
        try {
            // استخراج البيانات من query parameters
            const paymentStatus = req.query.success;
            const paymentId = req.query.id;
            const userId = req.query.profile_id;
            console.log(paymentStatus);
            console.log(paymentId);
            // تعديل أو تأكيد أن `profile_id` هو معرف المستخدم
            const paymentfirst = req.query.success;
            const paymentlast = req.query.success;
            // تحقق إذا كانت عملية الدفع ناجحة
            if (paymentStatus === 'true') {
                // استدعاء الخدمة لتحديث حالة الدفع والسلة
                await paymobService_1.default.handlePaymobWebhook(paymentId, Number(userId));
                console.log();
                // إعادة استجابة "تم الدفع بنجاح"
                return res.status(200).json({ message: 'تم الدفه بنجاح و المحاضره الان اصبحت متاحة' });
            }
            else {
                // إذا لم تكن عملية الدفع ناجحة
                return res.status(400).json({ message: 'فشل الدفع' });
            }
        }
        catch (error) {
            console.error('Error handling webhook:', error);
            return res.status(500).json({ message: 'حدث خطأ أثناء عمليه الدفع' });
        }
    }
}
const cartController = new CartController();
exports.default = cartController;
//# sourceMappingURL=cartController.js.map