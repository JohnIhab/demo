"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function joiAsyncMiddleWare(schema) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { error, value } = yield schema.validateAsync(req.body, {
                abortEarly: false,
            });
            if (error) {
                const validationErrors = error.details.map((detail) => detail.message);
                return res.status(400).json({ errors: validationErrors });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.default = joiAsyncMiddleWare;
