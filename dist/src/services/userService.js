"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class user {
    async contect_us(userid, data) {
        const { subject, message } = data;
        const user = await client_1.default.contact_Us.create({
            data: {
                subject,
                message,
                userId: userid
            }
        });
    }
    async view_user() {
        const user = await client_1.default.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                mobileNumber: true,
                role: true,
                block: true
            },
        });
        return user;
    }
    async view_one_user(userid) {
        const user = await client_1.default.user.findUnique({
            where: { id: userid },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                mobileNumber: true,
            },
        });
        return user;
    }
    async update_user(userid, data) {
        const { firstName, lastName, Password, newPassword, confirmNPassword, avatar } = data;
        const user = await client_1.default.user.findUnique({
            where: { id: userid },
            select: { password: true }
        });
        if (!user) {
            throw new ApiError_1.default("User not found", 404);
        }
        if (Password && newPassword && confirmNPassword) {
            const passwordMatch = await bcrypt_1.default.compare(Password, user.password);
            if (!passwordMatch) {
                throw new ApiError_1.default("Current password is incorrect", 400);
            }
            if (newPassword !== confirmNPassword) {
                throw new ApiError_1.default("New password and confirmation do not match", 400);
            }
            // Step 3: Hash the new password
            const hashedNewPassword = await bcrypt_1.default.hash(newPassword, 8);
            // Step 4: Update user with the new password and other fields
            await client_1.default.user.update({
                where: { id: userid },
                data: {
                    firstName,
                    lastName,
                    avatar,
                    password: hashedNewPassword
                }
            });
        }
        else {
            // Step 5: Update user without changing the password
            await client_1.default.user.update({
                where: { id: userid },
                data: {
                    firstName,
                    lastName,
                    avatar
                }
            });
        }
        const updatedUser = await client_1.default.user.findUnique({
            where: { id: userid },
            select: {
                firstName: true,
                lastName: true,
                mobileNumber: true,
                avatar: true
            }
        });
        return updatedUser;
    }
    //block user
    async getBlockedUsers() {
        const blockedUsers = await client_1.default.user.findMany({
            where: { block: true },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                mobileNumber: true,
                schooleYear: true,
            }
        });
        return blockedUsers;
    }
    async toggleBlockUser(userId) {
        // Fetch the current block status of the user
        const user = await client_1.default.user.findUnique({
            where: { id: userId },
            select: { block: true }
        });
        if (!user) {
            throw new Error(`User with ID ${userId} not found.`);
        }
        // Toggle block status: if blocked, unblock; if unblocked, block
        const newBlockStatus = !user.block;
        const actionMessage = newBlockStatus ? 'User blocked successfully.' : 'User unblocked successfully.';
        const updatedUser = await client_1.default.user.update({
            where: { id: userId },
            data: { block: newBlockStatus },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                mobileNumber: true,
                schooleYear: true,
                block: true
            }
        });
        return { message: actionMessage, user: updatedUser };
    }
    async deleteUser(userId) {
        const user = await client_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new ApiError_1.default("User not found", 404);
        }
        await client_1.default.cartItem.deleteMany({
            where: {
                cart: {
                    userId: userId,
                },
            },
        });
        await client_1.default.user_Codes.deleteMany({
            where: { userId: userId },
        });
        await client_1.default.cart.deleteMany({
            where: { userId: userId },
        });
        await client_1.default.contact_Us.deleteMany({
            where: { userId: userId },
        });
        const deleteUser = await client_1.default.user.delete({
            where: { id: userId },
        });
    }
}
const userService = new user();
exports.default = userService;
//# sourceMappingURL=userService.js.map