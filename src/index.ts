import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import dotenv from 'dotenv';
dotenv.config();

import snippetRouter from './routers/snippetsRouter';
import userRouter from './routers/userRouter';

const app = express();
const port = 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:9000'],
    credentials: true,
  })
);

app.listen(port, 'localhost', () => {
  console.log(`server starter on port ${port}`);
});

// Set up routers

app.use('/snippet', snippetRouter);
app.use('/auth', userRouter);

// connect to mongoDB

mongoose.connect(
  process.env['MONGO_CONNECTION'] as string,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('Connected to MongoDB');
  }
);

