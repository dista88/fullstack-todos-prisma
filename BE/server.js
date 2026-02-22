import express from "express";
import cors from "cors";
import todosRouter from "./routes/todos.js";
import authRouter from "./routes/authRoutes.js";
import { requireAuth } from "./middleware/auth.js";

const app = express();

const PORT = process.env.PORT;

//middleware
app.use(express.json());
app.use(cors());

app.use("/todos", requireAuth, todosRouter);
app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
