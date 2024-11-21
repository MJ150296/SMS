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
import schoolRouter from "./routes/school.routes.js";
import UserRegisterRouter from "./routes/userRegister.routes.js"; // For adding the user by superAdmin or Admin
import StudentsInfo from "./routes/student.route.js";
import classesRouter from "./routes/classes.routes.js";
import teachersRouter from "./routes/teachers.routes.js";
import adminsRouter from "./routes/admins.routes.js";
import eventsRouter from "./routes/events.routes.js";
import attendanceRouter from "./routes/attendance.routes.js";
import feesRouter from "./routes/allFeeRelated.routes.js";
import salaryRouter from "./routes/allSalaryRelated.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/school", schoolRouter);
app.use("/api/v1/register", UserRegisterRouter);
app.use("/api/v1/students", StudentsInfo); // Adding, Deleting & Updating a student will NOT be here. It will be UserRegisterRouter /api/v1/register
app.use("/api/v1/classes", classesRouter);
app.use("/api/v1/teachers", teachersRouter);
app.use("/api/v1/admins", adminsRouter);
app.use("/api/v1/events", eventsRouter);
app.use("/api/v1/attendance", attendanceRouter);
app.use("/api/v1/fees", feesRouter);
app.use("/api/v1/salary", salaryRouter);

export { app };
