import { Router } from "express";
import adminController from "../controllers/adminController";
import auth from "../middlewares/auth";
import { isAdmin } from "../middlewares/isAdmin";
import userController from "../controllers/userController";
const router = Router();


router.get("/contect",isAdmin , adminController.v_contect);
router.delete("/delete_us/:id" , isAdmin ,adminController.deletecontect_us)
router.get("/allusers",isAdmin , adminController.view_user);
router.get("/allblockUser" ,isAdmin ,userController.getBlockedUsers);
router.patch("/blockUser/:id" ,isAdmin , userController.toggleBlockUser);
router.delete("/deleteUser/:id" ,isAdmin , userController.deleteUser)
export default router;
