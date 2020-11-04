import express from "express";
import "./db/mongoose.js";
import userRouter from "./routers/users.js";
import taskRouter from "./routers/tasks.js";
import "./emails/account.js";
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => {
  console.log("Server ready...");
});
