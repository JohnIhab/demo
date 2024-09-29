"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importStar(require("axios"));
const client_1 = require("@prisma/client");
const dotenv_1 = require("dotenv");
const date_fns_1 = require("date-fns");
(0, dotenv_1.config)();
const prisma = new client_1.PrismaClient();
class PaymentService {
    constructor() {
        this.PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
        this.PAYMOB_PUBLIC_KEY = process.env.PAYMOB_PUBLIC_KEY;
        this.PAYMOB_SECRET_KEY = process.env.PAYMOB_SECRET_KEY;
        this.PAYMOB_VISA_INTEGRATION = process.env.PAYMOB_VISA_INTEGRATION_ID1;
        this.PAYMOB_VODAFONE_INTEGRATION = process.env.PAYMOB_VODAFONE_INTEGRATION_ID1;
        this.PAYMOB_KIOSK_INTEGRATION = process.env.PAYMOB_KIOSK_INTEGRATION_ID1;
    }
    // Function to calculate total price from the user's cart
    async calculateTotalPrice(userId) {
        const cart = await this.getCart(userId);
        const totalPrice = cart.items.reduce((total, item) => {
            const price = item.Lecture.price ? parseFloat(item.Lecture.price) : 0; // Convert string price to a number
            return total + price * item.quantity;
        }, 0);
        console.log(totalPrice);
        return totalPrice;
    }
    // Function to create payment intention and return client_secret
    async createPaymentIntention(userId, currency, billingData, paymentMethod) {
        var _a, _b;
        try {
            const totalPrice = await this.calculateTotalPrice(userId); // Get the total price from the cart
            console.log("Sending Payment Intention with:");
            console.log("Total Amount:", totalPrice);
            console.log("Billing Data:", JSON.stringify(billingData, null, 2));
            const authorizationHeader = `Token ${this.PAYMOB_SECRET_KEY}`;
            let paymentMethodId;
            // Determine the payment method ID based on the chosen method
            switch (paymentMethod) {
                case 'visa':
                    paymentMethodId = 4830111;
                    break;
                case 'vodafone_cash':
                    paymentMethodId = 4831291;
                    break;
                case 'kiosk':
                    paymentMethodId = 4839344;
                    break;
                default:
                    throw new Error("Invalid payment method");
            }
            const response = await axios_1.default.post('https://accept.paymob.com/v1/intention/', {
                amount: totalPrice * 100, // Amount in cents/piasters
                currency,
                payment_methods: [paymentMethodId], // Use the selected integration ID
                billing_data: billingData
            }, {
                headers: {
                    Authorization: authorizationHeader,
                }
            });
            const clientSecret = response.data.client_secret;
            await prisma.payment.create({
                data: {
                    paymentId: response.data.id,
                    paymentMethod,
                    amount: totalPrice * 100,
                    status: 'pending',
                }
            }); // This is the client_secret Paymob generates
            console.log(clientSecret);
            return {
                clientSecret,
                paymentUrl: `https://accept.paymob.com/unifiedcheckout/?publicKey=${this.PAYMOB_PUBLIC_KEY}&clientSecret=${clientSecret}`
            };
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError) {
                console.error("Error response:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                throw new Error(`Payment intention failed: ${((_b = error.response) === null || _b === void 0 ? void 0 : _b.data.message) || error.message}`);
            }
            else {
                console.error("Unexpected error:", String(error));
                throw new Error("An unexpected error occurred while creating payment intention");
            }
        }
    }
    async handlePaymobWebhook(webhookData) {
        const paymentStatus = webhookData.obj.status;
        const paymentId = webhookData.obj.id;
        await prisma.payment.update({
            where: { paymentId: paymentId },
            data: { status: paymentStatus },
        });
        if (paymentStatus === "paid") {
            await prisma.cartItem.updateMany({
                where: {
                    cart: { userId: webhookData.obj.user.id },
                    purchased: false,
                },
                data: { purchased: true },
            });
        }
    }
    async getCart(userId) {
        const cart = await prisma.cart.findFirst({
            where: { userId },
            include: {
                items: {
                    include: {
                        Lecture: true // Include Lecture details
                    }
                }
            }
        });
        if (!cart) {
            throw new Error(`Cart not found for user ID ${userId}`);
        }
        return cart;
    }
    async addLectureToCart(userId, lectureId) {
        const lecture = await prisma.lecture.findUnique({ where: { id: lectureId } });
        if (!lecture) {
            throw new Error(`Lecture with ID ${lectureId} does not exist`);
        }
        const now = new Date();
        const expiryDate = (0, date_fns_1.addDays)(now, 12);
        // Step 1: Upsert the cart based on userId
        let cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            // Create the cart if it doesn't exist
            cart = await prisma.cart.create({
                data: {
                    userId,
                },
            });
        }
        // Step 2: Upsert the cart item (lecture in the cart)
        const cartItem = await prisma.cartItem.upsert({
            where: {
                cartId_lectureId: {
                    cartId: cart.id,
                    lectureId
                }
            },
            create: {
                cartId: cart.id,
                lectureId,
                quantity: 1,
                purchaseDate: now,
                expiryDate: expiryDate,
            },
            update: {
                quantity: 1,
                purchaseDate: now, // If you want to update this on subsequent purchases
                expiryDate: expiryDate,
            }
        });
        return cartItem;
    }
}
exports.default = new PaymentService();
//# sourceMappingURL=paymobService1.js.map