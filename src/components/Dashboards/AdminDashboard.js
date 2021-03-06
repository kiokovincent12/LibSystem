import React, { useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'

import { AppBar, Paper, Button, Card, Badge, Table, TableBody, TableCell, TableRow, TableHead, TextField, Typography, Container } from '@material-ui/core';

import { checkInABook, checkOutABook, pendingRequests, unReturnedBooks, checkOutManually } from '../../actions/adminActions/adminActions';
import { getBooks} from '../../actions/adminActions/otherActions/actions';
import { EditForm } from '../EditBook/EditForm';

export const AdminDashboard = () => {

    const navigate = useNavigate();

    const admin = JSON.parse(localStorage.getItem('USER')).data;

    //create state to manage windows
    const [window, setWindow] = useState('home');
    const handleLogOut = (e) => {
        e.preventDefault();
        localStorage.removeItem('USER');
        navigate('/adminLogin');
    };

    return (
        <div id='adminDash'>
            <AppBar style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '50px' }}>
                <button onClick={(e) => {
                    e.preventDefault();
                    setWindow('home')
                }}>Home</button>
                <div>Welcome, {admin.name}</div>
                <button onClick={(e) => { handleLogOut(e) }}>Logout</button>
            </AppBar>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', marginTop: '75px' }}>
                <Container style={{ width: '20%', display: 'flex', flexDirection: 'column' }}>
                    <Card style={{ backgroundColor: 'blue', margin: '3px', cursor: 'pointer', color: 'white', padding: '10px 0 10px 20px' }} onClick={(e) => {
                        e.preventDefault();
                        setWindow('addBook')
                    }}>
                        Add A Book
                    </Card>
                    <Card style={{ backgroundColor: 'green', margin: '3px', cursor: 'pointer', color: 'white', padding: '10px 0 10px 20px' }} onClick={(e) => {
                        e.preventDefault();
                        setWindow('lendOut')
                    }}>
                        Issue A Book
                    </Card>
                    <Card style={{ backgroundColor: 'brown', margin: '3px', cursor: 'pointer', color: 'white', padding: '10px 0 10px 20px' }} onClick={(e) => {
                        e.preventDefault();
                        setWindow('returnBooks')
                    }}>
                        Return a book
                    </Card>
                    <Card style={{ backgroundColor: 'purple', margin: '3px', cursor: 'pointer', color: 'white', padding: '10px 0 10px 20px' }} onClick={(e) => {
                        e.preventDefault();
                        setWindow('explore')
                    }}>
                        Show Books
                    </Card>
                    <Card style={{ backgroundColor: 'orange', margin: '3px', cursor: 'pointer', color: 'white', padding: '10px 0 10px 20px' }} onClick={(e) => {
                        e.preventDefault();
                        setWindow('users')
                    }}>
                        Show Users
                    </Card>
                </Container>
                <div style={{ width: '80%' }}>
                    {window === 'home' && <Home setWindow={setWindow} />}
                    {window === 'addBook' && <AddNewBook />}
                    {window === 'lendOut' && <LendBooks />}
                    {window === 'returnBooks' && <ReturnABook />}
                    {window === 'explore' && <ExploreBooks />}
                </div>
            </div>
        </div>
    );
};

//home drawer:
const Home = ({ setWindow }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pendingRequests());
    }, [dispatch]);

    const list = useSelector(state => state.list);

    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', paddingTop: '50px'}}>
                <Card size='lg' align='center' style={{ borderRadius: '50%', height: '7rem', width: '7rem', backgroundColor: 'blue' }}>
                    <Button style={{ marginTop: 25 }} onClick={(e) => {
                        e.preventDefault();
                        setWindow('addBook')
                    }}>Add A New Book</Button>
                </Card>
                <Card size='lg' align='center' style={{ borderRadius: '50%', height: '7rem', width: '7rem', backgroundColor: 'green', marginTop: '100px' }}>
                    <Button style={{ marginTop: 25 }} onClick={(e) => {
                        e.preventDefault();
                        setWindow('lendOut')
                    }}>
                        Lend Out Books
                        <Badge badgeContent={!list ? 0 : list.length} color='error'>  {/*Fetch number pending book borrow requests*/}
                        </Badge>
                    </Button>
                </Card>
                <Card size='lg' align='center' style={{ borderRadius: '50%', height: '7rem', width: '7rem', backgroundColor: 'brown', marginTop: '75px' }}>
                    <Button style={{ marginTop: 25 }} onClick={(e) => {
                        e.preventDefault();
                        setWindow('returnBooks')
                    }}>Return a Book</Button>
                </Card>
                <Card size='lg' align='center' style={{ borderRadius: '50%', height: '7rem', width: '7rem', backgroundColor: 'purple', marginTop: '120px' }}>
                    <Button style={{ marginTop: 25 }} onClick={(e) => {
                        e.preventDefault();
                        setWindow('explore')
                    }}>Explore Books</Button>
                </Card>
                <Card size='lg' align='center' style={{ borderRadius: '50%', height: '7rem', width: '7rem', backgroundColor: 'orange', marginTop: '50px' }}>
                    <Button style={{ marginTop: 25 }} onClick={(e) => {
                        e.preventDefault();
                        setWindow('users')
                    }}>View Users</Button>
                </Card>
            </div>
    )
}

//lend out books
const LendBooks = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(pendingRequests());
    }, [dispatch]);

    const [details, setDetails] = useState({
        bookId: '',
        userEmail:''
    })
    const list = useSelector(state => state.list);

    //auto borrowing
    const handleCheckOut = (e, rqstId) => {
        e.preventDefault();
        dispatch(checkOutABook(rqstId));
        dispatch(pendingRequests());
    };
//for physical lib borrowing
    const manuallyCheckOut = (e, toBorrow) => {
        e.preventDefault();
        dispatch(checkOutManually(toBorrow));
        dispatch(pendingRequests());
    };

    return (
        <div>
            <h3>CHECK OUT BOOKS TO BORROWERS</h3>
            <Container style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                <Container>
                    <Card>      {/*if else statement for lists*/}
                        {!list? 'Cannot Fetch List':((list.length===0)? ('No Pending Requests to Show. Try Manual Check Out') :
                    (<Table>
                        <TableHead style={{backgroundColor:'lightcyan'}}>
                            <TableCell>Book</TableCell>
                            <TableCell>Book Title</TableCell>
                            <TableCell>Borrower Email</TableCell>
                            <TableCell>Chek out</TableCell>
                        </TableHead>
                        <TableBody>
                            {list.map((reqst) =>
                                <TableRow key={reqst._id}>
                                    <TableCell> <img src={reqst.bookId? reqst.bookId.coverImage:null } alt='coverImg' style={{ width: '40px', height: '50px', margin:'3px'}} /> </TableCell>
                                    <TableCell> {!reqst.bookId? 'No Book Data':reqst.bookId.title} </TableCell>
                                    <TableCell> {!reqst.bookId? 'No Book Data':reqst.userId.userEmail} </TableCell>
                                    <TableCell>
                                        <Button aria-label='Click to check book out' onClick={(e)=> handleCheckOut(e, reqst._id)}>
                                            Check Out
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>))}
                </Card>
                </Container>
                <Container style={{width:'400px'}}>
                    <Paper>
                        <Typography>Check out Manually</Typography>
                        <TextField label='Enter Book ID' onChange={(e)=>setDetails({...details, bookId:e.target.value})}/>
                        <TextField label='Enter User EMAIL' onChange={(e)=>setDetails({...details, userEmail:e.target.value})}/>
                        <Button onClick={(e) => {
                            manuallyCheckOut(e, details)
                        }}>CHECKOUT</Button>
                    </Paper>
                </Container>
            </Container>
        </div>
    );
};

//return a borrowed book to library
const ReturnABook = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(unReturnedBooks());
    }, [dispatch]);

    const list2= useSelector(state => state.list2);

    //receive a book, handle checkIn
    const handleCheckIn = (e, borrowId) => {
        e.preventDefault();
        if (window.confirm('All Fines Cleared? ')) {
            dispatch(checkInABook(borrowId));
            dispatch(unReturnedBooks());
        } else {
            alert('Client must clear pending fines first...')
            return
        }
    };

    //fines
    const fines = (date2, date1) => {
        const FINES_AMOUNT_PER_DAY = 10;
        const fine = (date2.getDate() - date1.getDate()) * FINES_AMOUNT_PER_DAY;
        return fine;
    };
   
    return (
        <div style={{height:'100vh'}}>
            <h3>RECEIVE BOOKS FROM BORROWERS</h3>
            <Container style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                <Container>
                    <Card>      {/*if else statement for lists*/}
                        {!list2? 'List Not found':((list2.length===0)? ('No Pending Borrowed Books to Show. Try Manual Check In') :
                    (<Table>
                        <TableHead style={{backgroundColor:'lightcyan'}}>
                            <TableCell></TableCell>
                            <TableCell>Book Title</TableCell>
                            <TableCell>Borrower</TableCell>
                            <TableCell>Date Borrowed</TableCell>
                            <TableCell>Date Expected</TableCell>
                            <TableCell>Fines Accrued</TableCell>
                            <TableCell>Chek in</TableCell>
                        </TableHead>
                        <TableBody>
                            {list2.map((brrw) =>
                                <TableRow key={brrw._id}>
                                    <TableCell> <img src={brrw.bookId.coverImage} alt='coverImg' style={{ width: '40px', height: '50px', margin:'3px'}} /> </TableCell>
                                    <TableCell> {brrw.bookId.title} </TableCell>
                                    <TableCell> {brrw.userId.userEmail}</TableCell>
                                    <TableCell> {new Date(brrw.dateBorrowed).toLocaleDateString()} </TableCell>
                                    <TableCell> {new Date(brrw.dateToReturn).toLocaleDateString()} </TableCell>
                                    <TableCell> {fines(new Date(), new Date(brrw.dateBorrowed))<1? 0:fines(new Date(), new Date(brrw.dateBorrowed))} </TableCell>
                                    <TableCell>
                                        <Button aria-label='Click to check book in' onClick={(e) => {
                                            handleCheckIn(e, brrw._id)
                                        }}>
                                            Check In
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>))}
                </Card>
                </Container>
                <Container style={{width:'400px'}}>
                    <Paper>
                        <Typography>Check In Manually</Typography>
                        <TextField label='Enter Book ID' />
                        <TextField label='Enter User EMAIL' />
                        <Button>CHECKIN BOOK</Button>
                    </Paper>
                </Container>
            </Container>
        </div>
    );
};

//add newBook
const AddNewBook = () => {
    //set state for windows
    const [method, setMethod] = useState(null)
    return (
        <div>
            <h3>ADD A NEW BOOK TO THE LIBRARY</h3>
            <button onClick={(e) => {
                e.preventDefault();
                setMethod('manual');
            }}>Fill Form</button>
            <button onClick={(e) => {
                e.preventDefault();
                setMethod('auto');
            }}>Scan RFID</button>
            {method === 'manual' && <EditForm />}
            {method==='auto' && (<Container>
                    <Paper align='center' style={{ width:'400px', margin:'50px', display:'flex', flexDirection:'column'}}>
                        <Typography>Scan RFID Tag</Typography>
                        <TextField variant='filled' label='Waiting for Scanner...' />
                        <Button >Submit</Button>
                    </Paper>
                </Container>)}
        </div>
    );
};

const ExploreBooks = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getBooks());
    }, [dispatch])

    const books = useSelector((state) => state.books)

    //set state for the selected book
    const [book, setBook] = useState(null);

    return (
        <div style={{ maxHeight: '700px', overflowY: 'unset' }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '50%', backgroundColor: 'initial' }}>
                    <Container align='left' style={{ overflowY: 'scroll', maxHeight: '100%' }}>
                        <h2>Explore {books.length} books in the Library</h2>
                        {books.map((book) =>
                            <Container onClick={(e) => {
                                setBook(book)
                            }} key={book._id} style={{ display: 'flex', flexDirection: 'row', fontSize: '0.75rem', borderBottom: 'solid 1px', padding: '5px', textAlign: 'left', width: '100%', cursor: 'pointer' }}>
                                <div >
                                    <img src={book.coverImage} alt='img' style={{ width: '40px', height: '50px', margin: '3px' }} />
                                </div>
                                <div>
                                    <p>{book.title}</p>
                                    <p>  Author: {book.author}.{book.noOfPages}pgs</p> </div>
                            </Container>)}
                    </Container>
                </div>
                {(!book) ? null : (
                    <div style={{ width: '50%', justifyContent: 'left' }}>
                        <div>
                            <h3>Book details</h3>
                            <h4>{book.title}</h4>
                            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                <div>
                                    <img src={book.coverImage} style={{ width: '200px', height: '300px', margin: '3px' }} alt='bookCover' />
                                </div>
                                <div style={{ textAlign: 'left', wordWrap: 'break-word', hyphens: 'auto' }}>
                                    <p>Author: {book.author}</p>
                                    <p>Subject: {book.subject}</p>
                                    <p>Edition: {book.edition}</p>
                                    <p>Size: {book.noOfPages} pages</p>
                                </div>
                                    <p>Preview: {book.preview}</p>
                                    <p>Tags: {book.tags.map((tag) => ` #${tag}`)}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};