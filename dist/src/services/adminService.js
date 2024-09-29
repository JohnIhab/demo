"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
class admin {
    async contect() {
        const contacts = await client_1.default.contact_Us.findMany({
            select: {
                id: true,
                subject: true,
                message: true,
                user: {
                    select: {
                        id: true,
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
        const user = await client_1.default.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                mobileNumber: true,
                schooleYear: true,
                role: true,
                block: true,
                googleId: true,
            },
        });
        return user;
    }
    async deletecontect_us(id) {
        const termId = parseInt(id);
        const user = await client_1.default.contact_Us.delete({ where: { id: termId } });
    }
}
const adminService = new admin();
exports.default = adminService;
//# sourceMappingURL=adminService.js.map