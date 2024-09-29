import prisma from "../../prisma/client";
import sendMails from "../utils/sendMails";
import ApiError from "../utils/ApiError";
import bcrypt from "bcrypt";
class admin {

async contect() {
    const contacts = await prisma.contact_Us.findMany({
        select: {
            id:true,
            subject: true,
            message: true,
            user: {
                select: {
                    id:true,
                    firstName: true,
                    lastName: true
                }
            }
        }
    });
  /*  const formattedContacts = contacts.map(contact => ({
        subject: contact.subject,
        message: contact.message,
        userName: `${contact.user.firstName} ${contact.user.lastName}`
    }));
*/
    return contacts;
}

async view_user() {
    const user = await prisma.user.findMany({
    select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        mobileNumber: true,
        schooleYear:true,
        role:true,
        block:true,
        googleId:true,
    },
    });
    return user;
}
async deletecontect_us(id:string) {
    const termId = parseInt(id);
    const user = await prisma.contact_Us.delete({where:{id:termId}});
}




}


const adminService = new admin();
export default adminService;
