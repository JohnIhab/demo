"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const cartController_1 = __importDefault(require("../controllers/cartController"));
const paymobController_1 = __importDefault(require("../controllers/paymobController"));
const router = (0, express_1.Router)();
// Add lecture to cart
router.post('/cart/add/:lectureId', auth_1.default, cartController_1.default.addToCart);
// Calculate total price
router.get('/cart/total-price', auth_1.default, cartController_1.default.calculateTotalPrice);
// Check access to a lecture
router.post('/cart/check-access', auth_1.default, cartController_1.default.checkLectureAccess);
router.post('/payment/initiate/:paymentMethod', auth_1.default, cartController_1.default.initiatePayment);
router.get('/payment/webhook', cartController_1.default.handlePaymobWebhook);
///new paymob 
router.post('/payment-intention/:method', auth_1.default, paymobController_1.default.createPaymentIntention);
router.post("/contect_us", auth_1.default, userController_1.default.contect_us);
router.get("/allusers", auth_1.default, userController_1.default.view_user);
router.get("/profile", auth_1.default, userController_1.default.view_one_user);
router.patch("/update", auth_1.default, userController_1.default.update_user);
router.get("/allblockUser", auth_1.default, userController_1.default.getBlockedUsers);
router.patch("/blockUser/:id", auth_1.default, userController_1.default.toggleBlockUser);
router.delete("/deleteUser/:id", auth_1.default, userController_1.default.deleteUser);
exports.default = router;
//# sourceMappingURL=userRouter.js.map