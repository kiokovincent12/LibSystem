import { Card, Container, Button } from '@material-ui/core'
import React, { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { getBooks } from '../../actions/adminActions/otherActions/actions';

export const HomePage = () => {

    return (
        <div>
            <Header />
            <div>
            <Container style={{ display: 'flex', justifyContent:'space-evenly', marginTop:'200px', backgroundColor:'white', height:'1000px'}}>
                <Button variant='text' component={Link} to='/loginPage'>Login/Register</Button>
                <Button variant='text' component={Link} to='/browselibrary'>Explore As a Guest</Button>
                </Container>
            </div>
            <Footer />
        </div>
    );
};

export const ExploreLibrary = () => {
        
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getBooks());
    })

    const books = useSelector((state) => state.books)

    return (
        <div >
            <Header />
            <div style={{ marginTop: '100px', width: '100%', display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '10%', height: '', backgroundColor: 'maroon' }}>
                    <h3>SideBar</h3>

                </div>
                <div style={{ width: '50%', backgroundColor: 'initial' }}>
                    <Container align='left'>
                        {books.map((book) =>
                            <Card key={book._id} style={{ display: 'flex', flexDirection: 'row', fontSize: '0.75rem', borderBottom: 'solid 1px', padding: '5px', textAlign: 'left', width: '90%' }}>
                                <div >
                                    <img src={book.coverImage} alt='img' style={{ width: '40px', height: '50px', margin: '3px' }} />
                                </div>
                                <div>
                                    <p>{book.title}</p>
                                    <p>  Author: {book.author}.{book.noOfPages}pgs</p> </div>
                            </Card>)}
                    </Container>
                </div>
                <div style={{ width: '40%', height: '', backgroundColor: 'yellowgreen' }}>
                    <h3>Item details</h3>
                </div>
            </div>
        </div>
    );
};
