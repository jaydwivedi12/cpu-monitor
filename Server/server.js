import express from 'express';
import dotenv from  'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import processRoutes from './routes/processRoutes.js'
import connectDB from './Config/connector.js';


// configure env
dotenv.config();

// database config
connectDB();

//rest boject
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

// routes
app.use('/api',processRoutes);

//rest api 

const PORT = process.env.PORT;

app.listen(PORT,(req,res)=>{
    console.log(`server Running on ${process.env.DEV_MODE} mode on port ${PORT}`)
})