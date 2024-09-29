import prisma from "../../prisma/client";
import sendMails from "../utils/sendMails";
import { contect_user,update_user  } from "../types/userType";
import ApiError from "../utils/ApiError";
import bcrypt from "bcrypt";
class user {

async contect_us(userid:number ,data: contect_user) {
    const { subject, message } = data;
    const user = await prisma.contact_Us.create({
    data:{
        subject,
        message,
        userId:userid
    }
});
}

async view_user() {
    const user = await prisma.user.findMany({
    select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        mobileNumber: true,
        role:true,
        block:true
    },
    });
    return user;
}

async view_one_user(userid:number) {
    const user = await prisma.user.findUnique({
    where:{id:userid},
    select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        mobileNumber:true,
        },
    });
    return user;
}


async update_user(userid:number , data:update_user){
    const { firstName , lastName ,  Password , newPassword , confirmNPassword , avatar }=data;
    const user = await prisma.user.findUnique({
        where: { id: userid },
        select: { password: true }
    });

    if (!user) {
        throw new ApiError("User not found", 404);
    }
    if (Password && newPassword && confirmNPassword) {
        const passwordMatch = await bcrypt.compare(Password, user.password);
        if (!passwordMatch) {
            throw new ApiError("Current password is incorrect", 400);
        }

        if (newPassword !== confirmNPassword) {
            throw new ApiError("New password and confirmation do not match", 400);
        }

        // Step 3: Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 8);

        // Step 4: Update user with the new password and other fields
        await prisma.user.update({
            where: { id: userid },
            data: {
                firstName,
                lastName,
                avatar,
                password: hashedNewPassword
            }
        });
        }else {
            // Step 5: Update user without changing the password
            await prisma.user.update({
                where: { id: userid },
                data: {
                    firstName,
                    lastName,
                    avatar
                }
            });
        }
        const updatedUser = await prisma.user.findUnique({
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
async  getBlockedUsers () {
    const blockedUsers = await prisma.user.findMany({
        where: { block: true },
        select: {
            firstName: true,
            lastName: true,
            email: true,
            mobileNumber: true,
            schooleYear:true,
        }
    });
    return blockedUsers;
}

async toggleBlockUser(userId: number) {
    // Fetch the current block status of the user
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { block: true }
    });

    if (!user) {
        throw new Error(`User with ID ${userId} not found.`);
    }

    // Toggle block status: if blocked, unblock; if unblocked, block
    const newBlockStatus = !user.block;
    const actionMessage = newBlockStatus ? 'User blocked successfully.' : 'User unblocked successfully.';
    const updatedUser = await prisma.user.update({
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

    return {message: actionMessage, user:updatedUser};
}

    async deleteUser  (userId: number)  {
        
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new ApiError("User not found", 404);
        }
        await prisma.cartItem.deleteMany({
            where: {
                cart: {
                    userId: userId,
                },
            },
        });
        await prisma.user_Codes.deleteMany({
            where: { userId: userId },
        });
    
        await prisma.cart.deleteMany({
            where: { userId: userId },
        });
        await prisma.contact_Us.deleteMany({
            where: { userId: userId },
        });
        
        const deleteUser = await prisma.user.delete({
            where: { id: userId },
        });
    }

}
const userService = new user();
export default userService;
