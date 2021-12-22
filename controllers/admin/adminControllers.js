import { Book, BorrowedBook, RequestedBook } from '../../dataModel/bookModel.js';
import { Notification } from '../../dataModel/messagesModel.js';
import { User } from '../../dataModel/userModel.js';

//1. add a book to library
export const addBooks = async (req, res) => {
    // const bookCode = Math.floor(Math.random() * 10000) + 1;
    const newBook = new Book({
        title: req.body.title,
        author: req.body.author,
        yearOfPublication: req.body.yearofPublication,
        edition: req.body.edition,
        volume: req.body.volume,
        editors: req.body.editors,
        cityPublished: req.body.cityPublished,
        publisher: req.body.publisher,
        noOfPages: req.body.noOfPages,
        category: req.body.category,
        discipline: req.body.discipline,
        subject: req.body.subject,
        tags: req.body.tags,
        coverImage:req.body.coverImage,
        preview:req.body.preview
    });

    try {
        const savedRecord = await newBook.save();
        res.status(201).send(savedRecord);

    } catch (error) {
        res.status(500).json(error);
    
    };
};

//2. remove book from library
export const deleteBooks = async (req, res) => {
    const { id } = req.params;
    try {
        await Book.findByIdAndRemove(id);
        res.status(200).json({message:'deleted'});

    } catch (error) {
        res.status(404).json(error)
    };
};

//3. edit book details
export const editBookDetails = async (req, res) => {
    const { id } = req.params;
    const toEdit = req.body;
    
    try {
        const book = await Book.findById(id);
        const updated = { _id: id, ...toEdit };     //edit without changing book ID
        await Book.save(updated);
        res.status(201).json(updated);

    } catch (error) {
        res.status(500).json(error);
    };
};

//5. get all users list with activated accounts
export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find();
        res.status(200).send(allUsers);
        
    } catch (error) {
        res.status(404).send(error);
    };
};

//6. get one lib user
export const getOneUser = async (req, res) => {
    const { email } = req.user;

    try {
       
        const user = await User.findOne({ userEmail:email });
        if (!user) {
            const msg = 'No Match Found. User does not exist';
            res.status(200).send(msg);
        } else {
            //get borrowed books, books in cart
            res.status(200).send(user);
        };

    } catch (error) {
        res.status(404).send(error);
    }
};

//7. get borrowed books requests pending processing - whose approval is false
export const getPendingRequests = async (req, res) => {
    try {
        const requests = await RequestedBook.find({ approved: false });
        if (!requests)res.status(200).send('No Pending Requests');
        else res.status(200).send(requests);
    } catch (error) {
        res.status(500).json(error);
    }
};

//4. process borrow request - auto lend out
export const lendOutBooks = async (req, res) => {
    const { id } = req.params; //THIS IS THE BORROWREQUEST ID, autogen

    try {
        //userId: email and ID
        const requested = await RequestedBook.findById(id);
        const { bookId, userId } = requested;
        
        //get dates for return
        function addDays(date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        }
        const dateToday = new Date()
        const toReturn = addDays(dateToday, 7);      //return after 7 days

        const approvedBook = new BorrowedBook({
            bookId: bookId,
            userId:userId,
            dateBorrowed: new Date(),
            dateToReturn: toReturn  //7 days later
        });
        
        await approvedBook.save();          //save to borrowedBooks (successfully borrowed);
        await RequestedBook.updateOne({ _id: id }, { $set: { approved: true } }); //change approval status

        //update User - remove pending request, and add borrowed book list; send a notification/message
        await User.updateOne({ _id: userId.id }, { $pull: { bookRequests: { _id: requested._id } } });
        await User.updateOne({ _id: userId.id }, { $push: { booksBorrowed: approvedBook } });
        
        const message = new Notification({
            sender: 'Admin',
            body: `Dear Library User, Your borrow request has been approved. Remember to return the book latest on ${approvedBook.dateToReturn} to avoid daily charged fines. Happy reading.`
        });
        
        await User.updateOne({ _id: userId.id }, { $push: { messages: message } });
        
        res.status(200).send('Book Checked out.');

    } catch (error) {
        console.error(error.message);
    }

};

//lend out books manually
export const lendOutManually = async (req, res) => {
    const { bookId, userEmail } = req.body;
    console.log('Chceking out a book manually')
    console.log(userEmail)
    
    try {
        //Verify Book Id
        const toBorrow = await Book.findById(bookId);
        //use if statement to capture and send 'Book Record not found. Ask for adding new book etc'
        //find Borrower by email in the system - SHOULD BE NATIONAL ID OR PASSPORT ETC
        const user = await User.findOne({ userEmail: userEmail });
        //save book to user's profile, and borrowed books list
        function addDays(date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        }
        const dateToday = new Date()
        const toReturn = addDays(dateToday, 7);      //return after 7 days

        const apporvedBook = new BorrowedBook({
            bookId: toBorrow,
            userId:user,
            dateBorrowed: new Date(),
            dateToReturn: toReturn  //7 days later
        });
        await apporvedBook.save();          //save to borrowedBooks (successfully borrowed);
        console.log('SAVED TO BORROWED BOOKS')
        
        res.send('Book Checked out')
        
    } catch (err) {
        console.log(err.message)
        res.send(err)
    }
}

//10. get successfully borrowed books
export const getBorrowedBooks = async (req, res) => {
    try {

        const borrowed = await BorrowedBook.find({returned:false});
        if (!borrowed) res.status(200).send('No records of successfully borrowed Books');
        else res.status(200).send(borrowed);
        
    } catch (error) {
        res.status(500).json(error);
    }
};

//11. get all borrowed books requests, approved and non-approved
export const getAllBorrowRequests = async (req, res) => {

    try {
        const requests = await RequestedBook.find();
        if (!requests) res.status(200).send('No Requests Found');
        else res.status(200).send(requests);

    } catch (error) {
        res.status(500).json(error);
    }
};

//5. receive back borrowed books
export const receiveBorrowedBooks = async (req, res) => {
          //lendOutID; - id of the lend out task
    const { id} = req.params;

    try {
        const returnThis = await BorrowedBook.findById(id);
        await BorrowedBook.updateOne({ _id: id }, { $set: { returned: true } });
        await BorrowedBook.updateOne({ _id: id }, { $set: { dateReturned: new Date() } });

        const returned = await BorrowedBook.findById(id);

        //remove from user's list and return as returned
        await User.updateOne({ _id: returnThis.userId.id }, { $pull: { booksBorrowed: { _id: returnThis._id } } });
        await User.updateOne({ _id: returnThis.userId.id }, { $push: { booksBorrowed: returned } });
        
        //remove from borrowed list
        await BorrowedBook.deleteOne({ _id: id });

        const { dateBorrowed, dateToReturn } = returnThis;

        const FINES_AMOUNT_PER_DAY = 10;
        const fine = ((dateToReturn.getDate() - dateBorrowed.getDate()))* FINES_AMOUNT_PER_DAY;

        if (fine > 0) res.status(200).send(`Book Returned. The User has KES ${fine} to pay as fines for late return Before CheckOut`);

        else res.status(200).send(`Book Returned on Time. Say thank you...`)

    } catch (error) {
        console.log(error);
    }
};