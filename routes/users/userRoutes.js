import express from 'express';
import {  placeOrder, addToCart, editProfile, submitReview, removeFromCart, cancelBookOrder} from '../../controllers/users/userControllers.js';
import {  loginUser, verifyToken } from '../../system/auth/auth.js';

const router = express.Router();

//1. new sign up - register as a member/user - in booksRoutes - not accessed by users
//2. login registered member - use authentication techniques
router.post('/login', loginUser);
//3. send request to borrow a book online
router.post('/books/borrow',verifyToken, placeOrder);
//4. add books to tray for later easy reference/retrieval
router.post('/books/cancelorder',verifyToken, cancelBookOrder);
//4. add books to tray for later easy reference/retrieval
router.patch('/books/addtocart/:id',verifyToken, addToCart);
//9. add books to tray for later easy reference/retrieval
router.patch('/books/removefromcart/:id',verifyToken, removeFromCart);
//6. change profile details such as profile picture, phoneNumber
router.patch('/editprofile',verifyToken, editProfile);
//7. write and submit a book review
router.post('/submitreview',verifyToken, submitReview);
//8. get suggested books (similar)

export default router;