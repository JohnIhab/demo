import prisma from "../../prisma/client";
import { SignUpType } from "../types/authType";
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError";
import generateOTP, { encrypt } from "../utils/generateOTP";
import { generateVerificationCode } from '../utils/verify';

class AuthService {
 
  async signUp(data: SignUpType  , role?: string) {
    const {email, password, firstName, lastName, mobileNumber ,schooleYear,  avatar } = data;
      const verificationToken = generateVerificationCode().toString();;
     const verificationTokenExpiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

      try {
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [
              { email },
              { mobileNumber }
            ]
          }
        });
    
        if (existingUser) {
          throw new Error('User with this email or mobile number already exists');
        }
        const user = await prisma.user.create({
          data: {
            firstName,
            lastName,
            email,
            password: await bcrypt.hash(password, 8),
            mobileNumber,
            schooleYear,
            avatar,
            role,
            verificationToken,
            verificationTokenExpiresAt
          },
          select: {
            firstName: true,
            lastName: true,
            email: true,
            mobileNumber: true,
            schooleYear:true,
            role: true,
          }
        });
        
            return user;
    
        } catch (error) {
        if (error instanceof Error) {
          console.error('Error during signup or sending email:', error.message);
          console.error('Stack trace:', error.stack);
        } else {
          console.error('An unknown error occurred:', error);
        }
        throw error; // Optionally re-throw to handle it further up the call stack
      }
    }
  async login(email: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new ApiError("Incorrect Email or password", 400);
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new ApiError("Incorrect Email or password", 400);
    }
    return user;
  }

  async forgetPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    const codes = generateOTP();
    await prisma.user_Codes.upsert({
      where: {
        userId: user.id,
      },
      update: {
        resetPasswordCode: codes.hashedOTP,
        resetPasswordCodeExpiresAt: new Date(codes.otpExpiration),
      },
      create: {
        resetPasswordCode: codes.hashedOTP,
        resetPasswordCodeExpiresAt: new Date(codes.otpExpiration),
        userId: user.id,
      },
    });
    return { email: user.email, code: codes.otp, username: user.firstName };
  }

  async verifyResetPasswordCode(email: string, code: string) {
    const hashedOTP = encrypt(code);
    const userCode = await prisma.user_Codes.findFirst({
        where: {
            resetPasswordCode: hashedOTP,
            resetPasswordCodeExpiresAt: {
                gte: new Date()
            },
            User: {
                email
            }
        }
    })
    if(!userCode){
        throw new ApiError("Code is Invalid Or Expired", 400)
    }
  }

    async resetPassword(email: string, password: string) {
        await prisma.user.update({
            where: {
                email
            },
            data: {
                password: await bcrypt.hash(password, 8)
            }
        })
    }
}

const authService = new AuthService();
export default authService;
