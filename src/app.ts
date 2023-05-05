import express, { Application } from "express";
import dbConnect from "./config/dbConnect";
import publicRouter from "./routes/Public/publicRoute";
import authRouter from "./routes/authRoute";
import userRouter from "./routes/User/userRoute";
import adminRouter from "./routes/Admin/adminRoute";
import { errorHandler, notFound } from "./middlewares/errorHandler";
import bodyParser from "body-parser";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// for connecting database
dbConnect();

// RequestBodyParser - it parse api request body
app.use(bodyParser.json());

// serving -  {{newspaper-public-host}} Create User, Login User
app.use("/api/public", publicRouter);

// serving -  {{newspaper-auth-host}} Create User, Login User
app.use("/api/auth", authRouter);

// serving -  {{newspaper-user-host}} Get Profile, Update Profile
app.use("/api/user", userRouter);

// serving -  {{newspaper-admin-host}} Get Profile, Update Profile, Delete Profile,
app.use("/api/admin", adminRouter);

app.get("*", (_, res) => {
  res.status(400).send({ Error: "page not found" });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
