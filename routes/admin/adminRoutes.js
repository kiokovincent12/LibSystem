import express from 'express';

import { addBooks, deleteBooks, editBookDetails, getAllUsers, getOneUser, getAllBorrowRequests, getPendingRequests, lendOutBooks, receiveBorrowedBooks, getBorrowedBooks, lendOutManually} from '../../controllers/admin/adminControllers.js';
import { adminLogin, createAdmin, verifyToken } from '../../system/auth/auth.js';

const router = express.Router();

//1. add a book to library;
router.post('/books', verifyToken, addBooks);
//2. delete a book from library
router.delete('/books/:id', verifyToken,deleteBooks);
//3. edit books details
router.patch('/books/:id', verifyToken,editBookDetails);
//4. lend out a book (process borrow request)
router.post('/books/lendout/:id',verifyToken, lendOutBooks);
//lend out manually
router.post('/books/manual/lendout',verifyToken, lendOutManually);
//6. get all users list
router.get('/users', getAllUsers);
//5. get one user info
router.get('/users/90', verifyToken, getOneUser);
//7. get list of borrowing requests
router.get('/books/pendingrequests', getPendingRequests);
//11. get all requests, approved and pending
router.get('/books/allrequests',getAllBorrowRequests);
//10. get list of approved borrow requests
router.get('/books/borrowedbooks', getBorrowedBooks);
//8. receive back books, using the borrowing Id
router.post('/books/receiveback/:id',verifyToken, receiveBorrowedBooks);

//signIn and SignUp Admin
router.post('/login', adminLogin);
router.post('/signup', createAdmin);

export default router;