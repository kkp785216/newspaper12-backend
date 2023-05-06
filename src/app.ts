import express, { Application } from "express";
import dbConnect from "./config/dbConnect";
import publicRouter from "./routes/Public/publicRoute";
import authRouter from "./routes/authRoute";
import userRouter from "./routes/User/userRoute";
import adminRouter from "./routes/Admin/adminRoute";
import { errorHandler, notFound } from "./middlewares/errorHandler";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// for connecting mongodb database
void dbConnect();

// RequestBodyParser - it parse api request body
app.use(express.json());

// serving -  {{newspaper-public-host}} Create User, Login User
app.use("/api/public", publicRouter);

// serving -  {{newspaper-auth-host}} Create User, Login User
app.use("/api/auth", authRouter);

// serving -  {{newspaper-user-host}} Get Profile, Update Profile
app.use("/api/user", userRouter);

// serving -  {{newspaper-admin-host}} Get Profile, Update Profile, Delete Profile,
app.use("/api/admin", adminRouter);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
