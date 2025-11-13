import { isAdminMiddleware,verifyTokenMiddleware } from '../middleware/authMiddleware';
import { signup, signIn, resetPassword } from '../controller/authController.js';    

router.post('/signup', signup); 
router.post('/signin',signIn);
router.put('/reset-password',verifyTokenMiddleware, resetPassword);


