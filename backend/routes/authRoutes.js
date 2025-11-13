import {verifyTokenMiddleware } from '../middleware/authMiddleWare.js';
import { signup, signIn, resetPassword,me } from '../controller/authController.js';    
import express from 'express';
const router = express.Router();    


router.post('/signup', signup); 
router.post('/signin',signIn);
router.put('/reset-password',verifyTokenMiddleware, resetPassword);

router.get('/me',verifyTokenMiddleware,me);

export default router;


