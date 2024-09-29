import { PrismaClient } from "@prisma/client";
import { addDays } from "date-fns";

const prisma = new PrismaClient();

class CartService {
    async addLectureToCart(userId: number, lectureId: number) {
        const lecture = await prisma.lecture.findUnique({ where: { id: lectureId } });
        if (!lecture) {
            throw new Error(`Lecture with ID ${lectureId} does not exist`);
        }
    
        const now = new Date();
        const expiryDate = addDays(now, 12);
    
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
                quantity:1,
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

    async getCart(userId: number) {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        Lecture: true, // Update to include lecture details
                    },
                },
            },
        });

        if (!cart) {
            throw new Error('Cart not found');
        }

        return cart;
    }

    async checkLectureAccess(userId: number, lectureId: number) {
        const cartItem = await prisma.cartItem.findFirst({
            where: {
                cartId: userId,
                lectureId: lectureId,
            },
        });

        if (!cartItem) {
            throw new Error("Lecture not found in the cart.");
        }

        const currentDate = new Date();
        if (cartItem.expiryDate && cartItem.expiryDate < currentDate) {
            throw new Error("Access to this lecture has expired.");
        }

        console.log("Access granted to the lecture.");
    }

    async calculateTotalPrice(userId: number) {
        const cart = await this.getCart(userId);
    
        const totalPrice = cart.items.reduce((total, item) => {
            const price = item.Lecture.price ? parseFloat(item.Lecture.price) : 0; // Convert string price to a number
            return total + price * item.quantity;
        }, 0);
         console.log("hi");
         
        return totalPrice;
    }
    

    async lockPurchasedItems(userId: number) {
        await prisma.cartItem.updateMany({
            where: {
                cart: { userId: userId },
                purchased: false,
            },
            data: { purchased: true },
        });
    }

    async unlockPurchasedItems(userId: number) {
        await prisma.cartItem.updateMany({
            where: {
                cart: { userId: userId },
                purchased: true,
            },
            data: {
                purchaseDate: new Date(),
                expiryDate: addDays(new Date(), 12),
            },
        });
    }
}

const cartService = new CartService();
export default cartService;
