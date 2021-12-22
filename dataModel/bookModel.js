import mongoose from 'mongoose';

//can add co-authors, 

const bookSchema = new mongoose.Schema({
    title: {                    //the only required parameter
        type: String,
        required: true
    },
    author: String,             
    yearOfPublication: Date,
    coverImage:String,          //cover thumbnail
    edition: String,
    volume: Number,             //for volumed books
    editors: [String],          //if available, especially in newspapers, classbooks
    preview: String,            //a synopsis of the book, contained in the book info
    cityPublished: String,      //eg Chicago
    publisher: String,          //eg Longhorn Publishers, Toronto University Press, etc
    noOfPages: Number,          //eg 231
    category: String,           //eg fiction, schoolreader, non-fiction, adventure, novel, short story, class text, periodical, magazine, etc
    discipline: String,         //eg philosophy, sociology and social sciences, health sciences, engineering, languages, religion, etc
    subject:String,             //eg mathematics, chemistry, theology, nutrition, english Literature, etc
    reviews: [String],          //list from users containing: name of reviewer, review text, date of review
    tags: [String],             //from admin, or made from single words as subject, yearofPublication, 
    ratings: [Number],          //received from users, range from 1 to 10, on how helpful, enjoyed, etc
    RFIDtag: String,            //unique identifier
    views: Number,              //number of times it is clicked by user; helps figure out most popular, or searched
    dateAdded: {                //date entered into database
        type: Date,           //showing time and date when entered; default
        default: new Date()
    }
});
export const Book = mongoose.model('libbooks', bookSchema);

//booked book to borrow (borrow request)
const borrowRequestSchema = new mongoose.Schema({
    bookId: Object,                 //a book can be requested by more than one person
    userId: Object,                 //min user object - email, phoneNo, name
    requestDate: {
        type: Date,
        default: new Date()
    },
    approved: {
        type: Boolean,
        default: false
    },
    approvedDate: Date,
    
});
export const RequestedBook = mongoose.model('borrowRequests', borrowRequestSchema);

//borrowed book schema
const borrowedBooksSchema = new mongoose.Schema({
    bookId: {
        type: Object,
        unique: true            //no book borrowed twice
    },
    userId: Object,             //with min details - email, name, and phone number
    dateBorrowed: Date,
    dateToReturn: Date,
    returned: {
        type: Boolean,
        default: false
    },
    dateReturned: {
        type: Date,
    }
});
export const BorrowedBook = mongoose.model('borrowedBooks', borrowedBooksSchema);
