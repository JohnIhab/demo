import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
  tls: {
    minVersion: 'TLSv1.2', // Ensure TLSv1.2 or higher is used
  }
});

export default async (data: any) => {
  // send mail with defined transport object
  await transporter.sendMail({
    from: '"Bioscope👻 " <foo@example.com>', // sender address
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    html: data.html, // html body
  });
};
