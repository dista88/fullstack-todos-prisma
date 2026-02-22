import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();
//get
router.get("/", async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: req.user.userId },
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

// POST
router.post("/", async (req, res) => {
  const { title } = req.body;

  try {
    const newTodo = await prisma.todo.create({
      data: { title, userId: req.user.userId },
    });
    res.status(201).json(newTodo);
    console.log("post success");
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

//delete
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await prisma.todo.findUnique({ where: { id: parseInt(id) } });

    if (!todo) return res.status(404).json({ message: "todo not found" });

    await prisma.todo.delete({ where: { id: parseInt(id) } });
    if (todo.userId !== req.user.userId)
      return res.status(403).json({ message: "forbidden" });
    console.log("delete success");
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

//update
router.patch("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { completed } = req.body;

    const updatedTodo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: { completed },
    });
    console.log("update success");
    res.json(updatedTodo);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
