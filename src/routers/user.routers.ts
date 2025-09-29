// IMPORTS
import { Router } from 'express';
import userController from "../controllers/user.controller.js";
import { check } from "express-validator";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = Router();

// ROUTERS FOR USER
router.get('/users', adminMiddleware('admin'), userController.getAllUsers);

router.post('/registration', [
    check('full_name', "Full name can't be a null!").trim().notEmpty(),
    check('email', "Incorrect email format!").normalizeEmail().isEmail(),
    check('birthday', "Birthday is require!").trim().notEmpty(),
    check('password', "Password length min 4 chars").trim().isLength({min: 4})
], userController.createUser);

router.post('/login', userController.authUser);

router.get('/user/:id', authMiddleware, userController.getUserById);

router.put('/user/:id', authMiddleware, userController.blockUsers);


export default router;