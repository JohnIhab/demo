"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartController_1 = __importDefault(require("../controllers/cartController"));
const paymob_1 = __importDefault(require("../controllers/paymob"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = (0, express_1.Router)();
router.get('/card', auth_1.default, cartController_1.default.getCart);
router.post('/initiate-payment', paymob_1.default.initiatePayment);
router.post('/webhook', paymob_1.default.handleWebhook);
exports.default = router;
//# sourceMappingURL=cartRouter.js.map