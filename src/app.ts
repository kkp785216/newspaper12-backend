import express, { Application, Request, Response } from 'express';
import dbConnect from './config/dbConnect';
import { config } from "dotenv";
import authRouter from "./routes/authRoute";
import userRouter from "./routes/userRoute";
import articleRouter from "./routes/Articles/articleRoute";
import articlesRouter from "./routes/Articles/articlesRoute";
import categoryRouter from "./routes/Categories/categoryRoute";
import categoriesRouter from "./routes/Categories/categoriesRoute";
import { errorHandler, notFound } from './middlewares/errorHandler';
import bodyParser from "body-parser";

// to load env file
config();

const app: Application = express();
const PORT = process.env.PORT || 8000;

// for connecting database
dbConnect();

// RequestBodyParser - it parse api request body
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

// serving -  {{newspaper-auth-host}} Create User, Login User
app.use('/api/auth', authRouter);

// serving -  {{newspaper-user-host}} Get Profile, Update Profile, Delete Profile,
app.use('/api/user', userRouter);

// serving -  article
app.use('/article', articleRouter);
app.use('/articles', articlesRouter);

// serving -  category
app.use('/category', categoryRouter);
app.use('/categories', categoriesRouter);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
});