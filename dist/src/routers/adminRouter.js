"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = __importDefault(require("../controllers/adminController"));
const isAdmin_1 = require("../middlewares/isAdmin");
const userController_1 = __importDefault(require("../controllers/userController"));
const router = (0, express_1.Router)();
router.get("/contect", isAdmin_1.isAdmin, adminController_1.default.v_contect);
router.delete("/delete_us/:id", isAdmin_1.isAdmin, adminController_1.default.deletecontect_us);
router.get("/allusers", isAdmin_1.isAdmin, adminController_1.default.view_user);
router.get("/allblockUser", isAdmin_1.isAdmin, userController_1.default.getBlockedUsers);
router.patch("/blockUser/:id", isAdmin_1.isAdmin, userController_1.default.toggleBlockUser);
router.delete("/deleteUser/:id", isAdmin_1.isAdmin, userController_1.default.deleteUser);
exports.default = router;
//# sourceMappingURL=adminRouter.js.map