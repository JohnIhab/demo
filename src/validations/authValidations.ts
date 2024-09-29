import Joi from "joi";
import { SignUpType, LoginType , verifyEmailType , resetEmailType , forgetEmailType} from "../types/authType";
import { Roles } from "../enum/roles";
import prisma from "../../prisma/client";

export const registerValidationSchema = Joi.object<SignUpType>().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string()
    .email()
    .pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)
    .external(async (value) => {
        const user = await prisma.user.findFirst({
          where: {
            email: value,
          },
        });
        if (user) {
          throw new Error("Email already exists");
        }
      })
    .required(),
    mobileNumber: Joi.string().required(),
  password: Joi.string().required(),
  confirm: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({ 'any.only': 'Passwords do not match' })
    .required(),
  role: Joi.string()
    .valid(...Object.values(Roles))
    .optional(),
    schooleYear: Joi.string().optional()
    .valid("First year", "Second year", "Third year")
    .messages({ 'any.only': 'Invalid school year    value First year or Second year  or Third year '}),
}); 

export const loginValidationSchema = Joi.object<LoginType>().keys({
  identifier: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const forgetValidationSchema = Joi.object<forgetEmailType>().keys({
  email: Joi.string().email().required(),
});
export const verifyValidationSchema = Joi.object<verifyEmailType>().keys({
  token: Joi.string().required(),
});
export const resetValidationSchema = Joi.object<resetEmailType>().keys({
  email:Joi.string().required(),
  password: Joi.string().required(),
  confirm: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({ 'any.only': 'Passwords do not match' })
    .required(),
});