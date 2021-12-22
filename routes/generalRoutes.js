import express from 'express';
import {  getAllBooks, getOneBook, searchBooks } from '../controllers/generalController.js';
import { signUpUser } from '../system/auth/auth.js';

const router = express.Router();

//see all books in the library
router.get('/books', getAllBooks);
//get specific book details
router.get('/books/:id', getOneBook);
//look up books for a category, or nature;
router.get('/books/v1/:query', searchBooks);
//sign up any user
router.post('/signup', signUpUser);
//activate account

export default router;