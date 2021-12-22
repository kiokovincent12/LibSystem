import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

import adminRoutes from './routes/admin/adminRoutes.js';
import userRoutes from './routes/users/userRoutes.js';
import forAllRoutes from './routes/generalRoutes.js';

//framework
const app = express();

//middlewares
app.use(cors());
app.use(bodyParser.json({ limit:'30mb', extended:true}));
app.use(bodyParser.urlencoded({ limit:'30mb', extended:true}));

//routers here
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/', forAllRoutes);

//environment variables
const SERVER_PORT = 5000;
const DB_CONNECTION_1 = 'mongodb://localhost:27017/LibSystemDb';

//database connection 1
mongoose.connect(DB_CONNECTION_1, { useNewUrlParser: true}, () => console.log('Connected to Library Database!...'));

//server connection
app.listen(SERVER_PORT, () => console.log(`Server listening on port ${SERVER_PORT}...`));