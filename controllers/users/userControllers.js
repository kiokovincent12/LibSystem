import { RequestedBook } from '../../dataModel/bookModel.js';
import { User } from '../../dataModel/userModel.js';
import { Book } from '../../dataModel/bookModel.js';
import { Notification } from '../../dataModel/messagesModel.js';

//borrow a book
export const placeOrder = async (req, res) => {
    //get req.user from authentication middleware - and find user by the email or the provided Id 
    const { bookId } = req.body;              //sent as body
    const userEmail = req.user.email;
    const userId = req.user.id;              //from authUser middleware - UserEmail, and userId

    try {
        const borrowedBook = await Book.findById(bookId) //gets all the details of the borrowed book
        //create borrower ID and details
        const borrower = {
            userEmail: userEmail,
            id:userId
        }
        //add order to the pending request list - general db
        const borrowDetails = new RequestedBook({ bookId: borrowedBook, userId: borrower });

        //push to the user's list the requested book details
        await User.updateOne({ _id: userId }, { $push: { bookRequests: borrowDetails } });
        //save
        await borrowDetails.save();
        //add notification to the user chatbox from system
        const newNotif = new Notification({
            body: `Your request to borrow ${borrowDetails.bookId.title} by ${borrowDetails.bookId.author} has been received by the Admin. You will be notified once your book is ready for collection. If you would like to cancel this request, use the dashboard cancel request button. Kindly note that all requests are processed during daylight hours EAT - 8AM to 7PM`,
            sender: 'sytem',
            receiver:userEmail
        });
        //send notification to user
        await User.updateOne({ _id: userId }, { $push: { notifications: newNotif } });
        //save to db
        await newNotif.save();

        res.status(201).send(`Book Borrowing Request Sent for book title: ${borrowDetails.bookId.title}`);

    } catch (error) {
        console.log({ error: error.message });
        res.end('Server Error')
    }
};

//cancel borrow request;
//This cancels by deleting requests from the user profile, and from the server
export const cancelBookOrder = async(req, res) => {
    const { bookId } = req.body; //Object _ids
    const userEmail = req.user.email;
    const userId = req.user.id;

    try {

        //get book details
        const bookDetails = await Book.findById(bookId);
        //find the request from list
        const borrowRequest = await RequestedBook.findOne({ bookId: bookDetails });
        //pull from the user's list
        await User.updateOne({ _id: userId }, { $pull: { bookRequests: { _id: borrowRequest._id }} } );

        //find book in the requested list and remove from list
        await RequestedBook.deleteOne({ _id:borrowRequest._id });
        //delete from user's list too of requests

        const newNotif = new Notification({
            body: `Your request to borrow ${borrowRequest.bookId.title} by ${borrowRequest.bookId.author} has been cancelled by the User. Kindly note that all requests are processed during daylight hours EAT - 8AM to 7PM`,
            sender: 'sytem',
            receiver:userEmail
        });
        //send notification to user
        await User.updateOne({ _id: userId }, { $push: { notifications: newNotif } });
        //save to db
        await newNotif.save();

        res.send('Borrow Request Cancelled by User');

    }catch(error) {
        console.log(error)
        res.send('Server Error')
    }
}

//addToCart
export const addToCart = async (req, res) => {
    const { id } = req.params;      //bookID
    const userId = req.user.id;      //logged in UserId

    try {
        const bookToAdd = await Book.findById(id)
        //append new book id addedto cart;;; must be a unique book not previously added
        await User.updateOne({ _id: userId }, { $push: { booksInCart: bookToAdd } });
        res.send('Added to Cart');

    } catch (error) {
        res.send('error');
    }
};

//remove book from cart
export const removeFromCart = async (req, res) => {
    const { id } = req.params; //book Id
    const userId = req.user.id;  //from verification
    
    try {
        //find book
        const toRemove = await Book.findById(id)
        //update user details
        await User.updateOne({ _id:userId }, { $pull: { booksInCart: toRemove } });
        res.status(201).send('Book Removed from list');

    } catch (error) {
        console.log(error)
        res.send('Server Error')
    }
};

//submit reviews
export const submitReview = (req, res) => {

}

//editprofile
export const editProfile = (req, res) => {
    
}