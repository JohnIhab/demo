"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function joiAsyncMiddleWare(schema) {
    return async (req, res, next) => {
        try {
            const { error, value } = await schema.validateAsync(req.body, {
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
    };
}
exports.default = joiAsyncMiddleWare;
//# sourceMappingURL=joiMiddleware.js.map