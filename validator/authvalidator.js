import { check, validationResult } from "express-validator";
import xss from "xss";

const sanitizeInput = (value)=>{
    return xss(value);
}

export const validateSignup = [
    check('name').trim()
    .notEmpty().withMessage("Name is required")
    .isLength({min:2}).withMessage("Name should be atleast 2 characters long")
    .customSanitizer(sanitizeInput),

    check('email').trim()
    .isEmail().withMessage("Invalid email")
    .normalizeEmail().customSanitizer(sanitizeInput),

    check('password').trim()
    .isLength({min:6}).withMessage("Password should be atleast 6 characters long")
    .customSanitizer(sanitizeInput),

    (req,res,next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        next();   
    }
]

export const validateLogin = [
    check('email').trim()
    .isEmail().withMessage("Invalid Email")
    .normalizeEmail().customSanitizer(sanitizeInput),

    check('password').trim()
    .notEmpty().withMessage("Password is required")
    .customSanitizer(sanitizeInput),

    (req,res,next)=>{
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(400).json({error:error.array()})
        }
        next();
    }
]