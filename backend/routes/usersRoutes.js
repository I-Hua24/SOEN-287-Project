
import {getAllUsers,getuserById,deleteUserById,updateUserInfo} from '../controller/usersController.js';
import { isAdminMiddleware,verifyTokenMiddleware } from '../middleware/authMiddleware.js';

import express from 'express';
const router = express.Router();


//router.put('/change-password', changePassword);

// Admin route to get all users

//router.use('/admin',verify token,isAdmin); // Middleware to verify admin access

router.get('/admin/users',verifyTokenMiddleware,isAdminMiddleware, getAllUsers);
// Admin route to get user by ID
router.get('/admin/users/:id',verifyTokenMiddleware,isAdminMiddleware, getuserById);

// Admin route to delete user by ID
router.delete('/admin/users/:id',verifyTokenMiddleware,isAdminMiddleware, deleteUserById);

router.put('/user/updateInfo',verifyTokenMiddleware,updateUserInfo)


export default router;
