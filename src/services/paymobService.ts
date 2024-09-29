import axios from 'axios';
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
config();

const prisma = new PrismaClient();

class PaymentService {
    private PAYMOB_PUBLIC_KEY = process.env.PAYMOB_PUBLIC_KEY!;
    private PAYMOB_SECRET_KEY = process.env.PAYMOB_SECRET_KEY!;
    private PAYMOB_VISA_INTEGRATION_ID = process.env.PAYMOB_VISA_INTEGRATION_ID1!;
    private PAYMOB_VODAFONE_INTEGRATION_ID = process.env.PAYMOB_VODAFONE_INTEGRATION_ID1!;
    private PAYMOB_KIOSK_INTEGRATION_ID = process.env.PAYMOB_KIOSK_INTEGRATION_ID1!;

    private createOrder(userId: number, totalPrice: number) {
        const authorizationHeader = `Token  ${this.PAYMOB_SECRET_KEY}`; 
        
        return axios.post('https://accept.paymob.com/api/ecommerce/orders', {
            delivery_needed: false,
            amount_cents: totalPrice * 100,
            currency: "EGP",
            items: [],
        }, {
            headers: {
                Authorization: authorizationHeader,
            }
        }).then(response => response.data.id);
    }

    private async createPaymentKey(orderId: number, totalPrice: number, integrationId: string, user: { firstName: string, lastName: string, email: string, phoneNumber: string }) {
        const authorizationHeader = `Token ${this.PAYMOB_SECRET_KEY}`;

        try {
            const response = await axios.post('https://accept.paymob.com/v1/intention/', {
                amount_cents: totalPrice * 100,
                expiration: 3600,
                order_id: orderId,
                billing_data: {
                    first_name: user.firstName,
                    last_name: user.lastName,
                    email: user.email,
                    phone_number: user.phoneNumber,
                    country: "EG",
                    city: "Cairo",
                    state: "Cairo",
                    street: "User Address",
                    postal_code: "12345",
                    building: "N/A",
                    floor: "N/A",
                    apartment: "N/A",
                },
                currency: "EGP",
                integration_id: integrationId,
            }, {
                headers: {
                    Authorization: authorizationHeader,
                }
            });

            const clientSecret = response.data.client_secret; 
            return { 
                clientSecret, 
                paymentUrl: `https://accept.paymob.com/unifiedcheckout/?publicKey=${this.PAYMOB_PUBLIC_KEY}&clientSecret=${clientSecret}` 
            };
        } catch (error) {
            console.error("Error creating payment key:", error);
            throw new Error("Failed to create payment key");
        }
    }

    async initiatePayment(userId: number, totalPrice: number, paymentMethod: "visa" | "vodafone_cash" | "kiosk") {
        const orderId = await this.createOrder(userId, totalPrice);
        
        let integrationId: string;
        if (paymentMethod === "visa") {
            integrationId = this.PAYMOB_VISA_INTEGRATION_ID;
        } else if (paymentMethod === "vodafone_cash") {
            integrationId = this.PAYMOB_VODAFONE_INTEGRATION_ID;
        } else if (paymentMethod === "kiosk") {
            integrationId = this.PAYMOB_KIOSK_INTEGRATION_ID;
        } else {
            throw new Error("Invalid payment method");
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error("User not found");
        }

        const paymentResponse = await this.createPaymentKey(orderId, totalPrice, integrationId, {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.mobileNumber || "01000000000",
        });

        await prisma.payment.create({
            data: {
                paymentId: paymentResponse.clientSecret,
                paymentMethod: paymentMethod,
                amount: totalPrice * 100,
                status: 'pending',
            }
        });

        return paymentResponse;
    }

    async handlePaymobWebhook(paymentId: string, userId: number) {

            await prisma.payment.update({
                where: { paymentId: paymentId },
                data: { status: 'paid' },  // يمكنك تعديل الحالة بناءً على الـ status المطلوب
            });
        
            // تحديث عناصر السلة التي تم شراؤها
            await prisma.cartItem.updateMany({
                where: {
                    cart: { userId: userId },
                    purchased: false,
                },
                data: { purchased: true },
            });
        }




}

export default new PaymentService();
