import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
app.use(express.static("public"));

app.use(cookieParser());

// Routes are imported here
import userRouter from "./routes/user.routes.js";
import schoolRouter from "./routes/school.routes.js"
import UserRegisterRouter from "./routes/userRegister.routes.js"  // For adding the user by superAdmin or Admin

app.use("/api/v1/users", userRouter);
app.use("/api/v1/school", schoolRouter);
app.use("/api/v1/register", UserRegisterRouter);


export { app };
