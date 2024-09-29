import { Router } from "express";
import userController from "../controllers/userController";
import auth from "../middlewares/auth";
import { authenticate } from '../middlewares/authenticate';
import cartController from '../controllers/cartController';
import  PaymentController  from "../controllers/paymobController";
const router = Router();

// Add lecture to cart
router.post('/cart/add/:lectureId', auth ,cartController.addToCart);

// Calculate total price
router.get('/cart/total-price',auth , cartController.calculateTotalPrice);

// Check access to a lecture
router.post('/cart/check-access',auth , cartController.checkLectureAccess);

router.post('/payment/initiate/:paymentMethod',auth , cartController.initiatePayment);

router.get('/payment/webhook' ,cartController.handlePaymobWebhook);

///new paymob 
router.post('/payment-intention/:method',auth , PaymentController.createPaymentIntention);

router.post("/contect_us", auth, userController.contect_us);

router.get("/allusers",auth,userController.view_user);

router.get("/profile", auth ,userController.view_one_user);

router.patch("/update",auth , userController.update_user);
router.get("/allblockUser" ,auth ,userController.getBlockedUsers);
router.patch("/blockUser/:id" ,auth ,  userController.toggleBlockUser);
router.delete("/deleteUser/:id" ,auth , userController.deleteUser)
export default router;
