import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import { User } from '../../dataModel/userModel.js';
import { Admin } from '../../dataModel/adminModel.js';

//LOGIN, SIGNUP,  AND AUTHENTICATIONS FILE

//sign up as a user
export const signUpUser = async (req, res) => {
    try {
        //hashPassword
        const securePassword = await bcrypt.hash(req.body.userPassword, 5);

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userEmail: req.body.userEmail,
            userPhone: req.body.userPhone,
            userPassword: securePassword
        });
        await user.save();      //can also use User.create(user)
        //return response ok
        res.json({ status: 'ok', message: 'User Registered Successfully' });

    } catch (error) {
        console.log(JSON.stringify(error))  //reveals the error code 11000 - standard error for a duplicate key-value pair
        if (error.code === 11000) res.json({ status: 'error', message: 'Account With that email or Phone Number Exists' })
        else res.status(501).send(error)
    };
};
const ACCESS_TOKEN_SECRET = 'oji94her78hcjkan00rt'
const REFRESH_TOKEN_SECRET = 'iusd6vb8ae7ile@jbidga'

//login as a user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        //find user by email. .lean() narrows the search result to bare minimum of finding the user
        const user = await User.findOne({ userEmail: email }).lean();
        if (!user) {
            res.json({ status: 'error', message: 'Invalid Email/Password' });
        } else {
            //match hashed password with the one in account
            if (await bcrypt.compare(password, user.userPassword)) {
                //produce a LOGIN TOKEN
                const token1 = jsonwebtoken.sign({
                    id: user._id,
                    email: user.userEmail
                }, ACCESS_TOKEN_SECRET, { expiresIn: '1h'});

                //REFRESH TOKEN
                const token2 = jsonwebtoken.sign({
                    id: user._id,
                    userEmail: user.userEmail
                }, REFRESH_TOKEN_SECRET, { expiresIn: 200 });
                
                //create user details for storage - session and local storage
                const currentUser = {
                    userEmail: email,
                    userName: user.firstName,
                    token: token1
                };

                //send the user details of token and email
                res.json({ status: 'ok', message: currentUser })
                  
            } else {
                console.log('Wrong Password')
                res.json({ status: 'error', message: 'Invalid Email/Password' });
            }
        };
        
    } catch (e) {
        //any other uncaught error
        res.json({ status: 'error', message: e })
    }
};

//authenticate token - during all the requests that require verification
export const verifyToken = (req, res, next) => {
    //authenticate token found in local storage
    //get the token from from header called [Authorization]
    const authHeader = req.headers.authorization.split(' ')[1];
    
    if (authHeader === undefined) res.json({ status: 'error', message: 'User Cannot Be Verified' });
    jsonwebtoken.verify(authHeader, ACCESS_TOKEN_SECRET, ((err, user) => {
        if (err) {
            console.log(err)
            res.json({ status: 'error', message: 'User cannot be verified' })
        };
        req.user = user;   //contains user email as 'email' and user Id as 'id'
        next();
    }));
};

//admin authentication
//1.Admin Login
export const adminLogin = async(req, res) => {
    const { keyCode, email } = req.body;
    try {
        const isAdmin = await Admin.findOne({ adminEmail:email });
        if (!isAdmin) res.json({ status: 'error', message: 'Invalid Credentials' });

        //compare encrypted passwords
        if (await bcrypt.compare(keyCode, isAdmin.keyCode)) {
            
            //generate a token
            const token = jsonwebtoken.sign({
                email:email
            }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

            //storage details
            const admin = {
                name: isAdmin.name,
                email: isAdmin,
                token: token
            };
            
            res.json({status:'ok', message:admin})
        } else {
            res.json({status:'error', message:'Invalid Credentials'})
        };
        
    } catch (err) {
        console.log(err)
        res.json({status:'error', message:'Login Unsuccessful'})
        
    }
};

//2. admin verify - uses verifyToken
//3. Add Admin by moderator
export const createAdmin = async (req, res) => {
    try {
        const secretKey = await bcrypt.hash(req.body.keyCode, 10);
        const newAdmin = new Admin({
            name:req.body.name,
            phone:req.body.phone,
            adminEmail: req.body.email,
            keyCode: secretKey
        });

        await newAdmin.save();
        res.json({ status: 'ok', message: 'Admin Account Created Successfully' });
    
    } catch (e) {
        console.log(e)
        res.json({ status: 'error', message: 'Admin could not be created' });
    }
};