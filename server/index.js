import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';
import userRouter from './route/user.route.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet({
    crossOriginResourcePolicy: false
}));

// Test Route
app.get('/', (req, res) => {
    res.json({
        message: `Server is running on port ${process.env.PORT}`
    });
});

app.use('/api/user', userRouter)


// Start Server
connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`✅ Server is running on port ${process.env.PORT}`);
    });
}).catch((err) => {
    console.error('❌ Failed to connect to database:', err);
});
