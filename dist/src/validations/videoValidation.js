"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation schema for creating or updating video details
exports.videoValidationSchema = joi_1.default.object({
    title: joi_1.default.string().required().messages({ 'string.empty': 'Title is required' }),
    subtitle: joi_1.default.string().optional(),
    price: joi_1.default.number().positive().required().messages({ 'number.base': 'Price must be a number', 'number.positive': 'Price must be greater than zero' }),
    academicYear: joi_1.default.string().required()
        .valid('First year', 'Second year', 'Third year')
        .messages({ 'any.only': 'Invalid academic year. Valid values are: First year, Second year, Third year' }),
    url: joi_1.default.string().uri().optional().messages({ 'string.uri': 'Invalid URL format' }),
    imageUrl: joi_1.default.string().uri().optional().messages({ 'string.uri': 'Invalid URL format' }),
});
//# sourceMappingURL=videoValidation.js.map