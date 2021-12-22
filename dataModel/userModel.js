//model for user info required for sign-up, and to borrow books, and fines stored
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {                //use official names (though not verifiable)
        type: String,
        require:true
    },
    lastName: {                 
        type: String,
        require:true
    },
    otherNames: String,
    profilePhoto:String,        //use type:image if available; images are stored in form of strings
    userEmail: {                //to be used for login, or phone number. Unique
        type: String,
        unique: true
    },
    userPhone: {                //has to be unique user number, 10 chars; can use it to login. Cannot be used in multiple accts
        type: Number
    },
    gender: {                   //to help in tracking users and liked categories in relation to gender
        type: String
    },
    dateOfBirth: Date,          //track users by age
    userAddress: {              //for delivery of books, later find how to fill valid coutries and counties
        country: String,
        county: String,
        town: String,
        street: String
    },
    userPassword: {             //encrypt passwords; bcrypt
        type: String
    }, 
    booksInCart: [Object],      //stores full info of books stored in cart
    booksBorrowed: [Object],    //stores Ids of borrowed books
    bookRequests: [Object],     //stores object Ids of requested books
    finesDue: Number,           //Fines due, according to cumulative books borrowed
    messages: [Object],         //gathers all messages, read and unread - time, read/unread, body
    notifications:[Object]      //alerts and urgent info, eg adverts, book borrow cancelled, etc. 
});

export const User = mongoose.model('libusers', userSchema);