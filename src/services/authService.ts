import prisma from "../../prisma/client";
import { SignUpType , verifyEmailType} from "../types/authType";
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError";
import generateOTP, { encrypt } from "../utils/generateOTP";
import sendMails from "../utils/sendMails";
import { v4 as uuidv4 } from 'uuid';
import { generateVerificationCode } from '../utils/verify';

class adminService {

  async signUp(data: SignUpType  , role?: string) {
    const {email, password, firstName, lastName, mobileNumber ,schooleYear,  avatar } = data;
      const verificationCode = generateVerificationCode();
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
        const baseUrl = 'https://bioscope-rosy.vercel.app'; // Base URL of your application
        const endpoint = '/api/auth/verifyEmail'; // Path to the verification endpoint
        const verificationLink = `${baseUrl}${endpoint}?token=${verificationToken}`;
    // SMS message content
        const emailSubject = 'د/ جلال نبيل';
        const emailData = {
          to: email,
          subject: `Email Verification ${emailSubject}`,
          html: `<p>Your verification code is: <strong>${verificationLink}</strong></p>`,
        };

        await sendMails(emailData);
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

    async verifyEmail(data: verifyEmailType) {
      const { token } = data;
    
      // Find the user with the given token
      const user = await prisma.user.findFirst({
        where: {
          verificationToken: token,
          verificationTokenExpiresAt: {
            gte: new Date(), // Check if token is not expired
          }
        }
      });
    
      if (!user) {
        throw new Error('Invalid or expired token');
      }
      // Update user to mark email as verified
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailverified: true, // Assuming you have a field for email verification
          verificationToken: null, // Optionally clear the token
          verificationTokenExpiresAt: null // Optionally clear the token expiration
        }
      });
    }
    

  async login(identifier: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { mobileNumber: identifier }  // Adjust this if the field name is different
        ]
      }
    });
    if (!user) {
      throw new ApiError("Incorrect Email or password", 400);
    }
    if (user.block) {
      throw new ApiError("Your account has been blocked. Please contact support.", 403);
  }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new ApiError("Incorrect Email or password", 400);
    }

  if (!user.emailverified) {
    throw new Error('Email not verified. Please check your message for the verification code.');
  } 
    return user;
  }
  //auht by google



  
  async  logout(userid:number) {
    // Update the user's session data to mark them as logged out
    const updatedUser = await prisma.user.update({
      where: {
        id: userid,
      },
      data: {
        lastLogout: new Date(), 
      },
    });
}

async forgetPassword(email: string) {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (!user || user.block) {
    throw new ApiError("User not found or block", 404);
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
  const emailSubject = 'Your Password Reset Code';
const emailHtml = `
  <p>Hello ${user.firstName},</p>
  <p>Your password reset code is: <strong>${codes.otp}</strong>. It is valid for the next 10 minutes.</p>
  <p>Best regards,<br/>Your Team</p>
`;

await sendMails({
  to: user.email,
  subject: emailSubject,
  html: emailHtml,
});
  console.log(codes);
  
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
  
  await prisma.user.update({
    where: {
      email,
    },
    data: {
      isResetCodeVerified: true,
    },
  });

}

  async resetPassword(email: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user || !user.isResetCodeVerified) {
      throw new ApiError("Reset code not verified ", 400);
    }
    if (user.block) {
      throw new ApiError("User  blocked", 404);
    }
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


const authService = new  adminService ();
export default authService;



