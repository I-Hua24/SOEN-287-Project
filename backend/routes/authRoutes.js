import {verifyTokenMiddleware } from '../middleware/authMiddleware.js';
import { signup, signIn, resetPassword,me,signOut } from '../controller/authController.js';    
import express from 'express';
const router = express.Router();    


router.post('/signup', signup); 
router.post('/signin',signIn);
router.put('/reset-password',verifyTokenMiddleware, resetPassword);

router.get('/me',verifyTokenMiddleware,me);

router.post('/signout',signOut);

export default router;


