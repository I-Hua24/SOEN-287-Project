
import {signup,signIn,getAllUsers,getuserById,resetPassword,deleteUserById} from '../controller/usersController.js';
import express from 'express';
const router = express.Router();

// User signup route
router.post('/signup', signup); 
// User sign-in route
router.post('/signin', signIn);
// Reset password route
router.put('/reset-password', resetPassword);
// Change password route
//router.put('/change-password', changePassword);

// Admin route to get all users

//router.use('/admin',verify token,isAdmin); // Middleware to verify admin access

router.get('/admin/users', getAllUsers);
// Admin route to get user by ID
router.get('/admin/users/:id', getuserById);

// Admin route to delete user by ID
router.delete('/admin/users/:id', deleteUserById);


export default router;
