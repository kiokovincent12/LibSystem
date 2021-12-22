//This Controller is available for all - reqistered and unreg users, admins, and general public. They can search, explore and get a list of all books in the library
import { Book } from "../dataModel/bookModel.js";
import { User } from "../dataModel/userModel.js";

//get all books;
export const getAllBooks = async (req, res) => {
    try {
        const allBooks = await Book.find();
        res.status(200).send(allBooks);

    } catch (error) {
        res.status(404).json(error);  
    };
};

//get one book on click on it
export const getOneBook = async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Book.findById(id);
        res.status(200).send(book);
    } catch (error) {
        console.log('There was an error' + `{message: ${error.message}}`)
        res.status(404).json(error);
    };
};

//query books by title, author, category, year etc
export const searchBooks = async (req, res) => {
    const { query } = req.params;

    try {
        const searchResult = await Book.find({ query });
        if (!searchResult) {
            searchResult = 'No Matches Found';
        };
        res.status(200).send(searchResult);
    } catch (error) {
        res.status(500).json(error);
    }
}