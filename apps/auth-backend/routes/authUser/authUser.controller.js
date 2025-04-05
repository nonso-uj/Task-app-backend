import Joi from "joi";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from 'crypto';
import AuthUser from "../../models/AuthUser.js";
import { generateResetToken } from "../../utils/helperFunctions.js";
import PasswordResetToken from "../../models/PasswordResetToken.js";

dotenv.config();

const DATE_NOW = new Date();

export const RegisterUser = async (req, res, next) => {
    const validateRequest = Joi.object({
        firstName: Joi.string().required().messages({
            'string.empty': 'First name is required',
            'any.required': 'First name is required'
        }),
        lastName: Joi.string().required().messages({
            'string.empty': 'Last name is required',
            'any.required': 'Last name is required'
        }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please enter a valid email address',
                'string.empty': 'Email is required',
                'any.required': 'Email is required'
            }),
        password: Joi.string()
            .min(8)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
            .required()
            .messages({
                'string.min': 'Password must be at least 8 characters long',
                'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
                'string.empty': 'Password is required',
                'any.required': 'Password is required'
            })
    });

    const { error } = validateRequest.validate(req.body);
    if(error){
        const [{ message }] = error.details;
        return res.status(400).json({
            success: false,
            error: message
        });
    }

    try{
        const newUser = new AuthUser({ ...req.body });
        await newUser.save();
        res.status(201).json({
            success: true,
            message: "New user created successfully"
        })
    }catch(error){
        console.log("Error creating user: ", error)
        res.status(400).json({
            success: false,
            message: "Something went wrong",
            error: `${error}`
        })
    }
}

export const LoginUser = async (req, res, next) => {
    const validateRequest = Joi.object({
        email: Joi.string()
            .required('Email is required'),
        password: Joi.string()
            .required('Password is required')
    });

    const { error } = validateRequest.validate(req.body);
    if(error){
        const [{ message }] = error.details;
        return res.status(500).json({
            success: false,
            error: message
        });
    }

    const { email, password } = req.body;

    try{
        const user = await AuthUser.findOne({ email: email });
        if(!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 1800 });
        res.status(200).json({ user, token });
    }catch(error){
        console.log('sign in error= ', error);
        res.status(500).json({
            error: "Server error"
        });
    }
}


export const sendResetToken = async (req, res, next) => {
    const validateRequest = Joi.object({
        email: Joi.string()
            .email()
            .required('Email is required')
    });

    const { error } = validateRequest.validate(req.body);
    if(error){
        const [{ message }] = error.details;
        return res.status(500).json({
            success: false,
            error: message
        });
    }

    const { email } = req.body;
    
    const user = await AuthUser.findOne({email: email});
    
    if(user){
        const { resetToken, hashedToken, resetExpires } = await generateResetToken();

        const newToken = new PasswordResetToken({
            user_id: user._id,
            token: hashedToken,
            token_expiry: new Date(resetExpires),
        })

        await newToken.save();
        
        const resetUrl = `${process.env.APP_URL}/auth/set-new-password?token=${resetToken}`;
    
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: { user: process.env.EMAIL_HOST_USER, pass: process.env.EMAIL_HOST_PASSWORD },
        });
        
        await transporter.sendMail({
            to: user.email,
            subject: 'Password Reset (Valid for 1 hour)',
            html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
        });
    }

    res.status(200).json({
        success: true,
        message: "Email sent"
    })
}

export const resetPassword = async (req, res, next) => {
    const { token, password } = req.body;

    if(!token || !password){
        return res.status(500).json({
            success: false,
            error: 'Invalid credentials!'
        });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const hashedPassword = await PasswordResetToken.findOne({
        token: hashedToken
    });

    console.log('hashedPassword= ', hashedPassword);

    if(!hashedPassword){
        return res.status(500).json({
            success: false,
            error: 'Invalid token!'
        });
    }

    const tokenExpiry = hashedPassword.token_expiry > DATE_NOW;

    if(!tokenExpiry){
        return res.status(500).json({
            success: false,
            error: 'Token is expired!'
        });
    }

    try{
        const user = await AuthUser.findById(hashedPassword.user_id)

        if(!user){
            return res.status(500).json({
                success: false,
                error: 'User does not exist!'
            });
        }

        user.password = password;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    }catch(error){
        console.log('Resest password error= ', error);
        return res.status(500).json({
            success: false,
            error: 'Invalid token'
        });
    }
}