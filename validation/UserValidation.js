const joi = require("joi");

// Define the user schema using Joi
const userSchema = joi.object({
    name: joi.string().required().messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required'
    }),
    
    email: joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),

    phone_number: joi.string().required().messages({
        'string.empty': 'Phone number is required',
        'any.required': 'Phone number is required'
    }),

    location: joi.string().required().messages({
        'string.empty': 'Location is required',
        'any.required': 'Location is required'
    }),

    password: joi.string().required().messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required'
    }),

    role: joi.string().valid("User", "Service Provider").required().messages({
        'any.only': 'Role must be either "User" or "Service Provider"',
        'any.required': 'Role is required'
    }),

    bio: joi.when("role", {
        is: "Service Provider",
        then: joi.string().required().messages({
            'string.empty': 'Bio is required for Service Provider role'
        }),
        otherwise: joi.forbidden()
    }),

    description: joi.when("role", {
        is: "Service Provider",
        then: joi.string().required().messages({
            'string.empty': 'Description is required for Service Provider role'
        }),
        otherwise: joi.forbidden()
    }),

    hourlyRate: joi.when("role", {
        is: "Service Provider",
        then: joi.number().required().messages({
            'number.base': 'Hourly rate must be a number for Service Provider role',
            'any.required': 'Hourly rate is required for Service Provider role'
        }),
        otherwise: joi.forbidden()
    }),

    services: joi.when("role", {
        is: "Service Provider",
        then: joi.array().items(joi.string()).required().messages({
            'array.base': 'Services must be an array of strings for Service Provider role',
            'any.required': 'Services are required for Service Provider role'
        }),
        otherwise: joi.forbidden()
    }),
});

// Middleware to validate the user data in the request body
function validateUser(req, res, next) {
    const { error } = userSchema.validate(req.body, { abortEarly: false });
    if (error) {
        // Join all error messages together and return a single response
        return res.status(400).json({
            message: error.details.map(detail => detail.message).join(", ")
        });
    }
    next();
}

module.exports = validateUser;
