import Joi from 'joi';
import {video }from '../types/videoType'; // Adjust the path as needed

// Validation schema for creating or updating video details
export const videoValidationSchema = Joi.object<video>({
    title: Joi.string().required().messages({ 'string.empty': 'Title is required' }),
    subtitle: Joi.string().optional(),
    price: Joi.number().positive().required().messages({ 'number.base': 'Price must be a number', 'number.positive': 'Price must be greater than zero' }),
    academicYear: Joi.string().required()
        .valid('First year', 'Second year', 'Third year')
        .messages({ 'any.only': 'Invalid academic year. Valid values are: First year, Second year, Third year' }),
    url: Joi.string().uri().optional().messages({ 'string.uri': 'Invalid URL format' }),
    imageUrl: Joi.string().uri().optional().messages({ 'string.uri': 'Invalid URL format' }),
});