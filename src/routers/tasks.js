import express from "express";
import Task from "../models/task.js";
import auth from "../middleware/auth.js";
import { getTasks } from "../services/tasks.js";
const router = new express.Router();

router.get("/tasks", auth, async (req, res) => {
  try {
    const tasks = await getTasks(req, 1);
    res.status(200).send(tasks);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (task) {
      await task.populate("owner").execPopulate();
      res.send(task);
    } else {
      res.status(404).send({ error: "Task not found" });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const { body } = req;
  const updates = Object.keys(body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Operation not allowed" });
  }
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (task) {
      updates.forEach((update) => {
        task[update] = body[update];
      });
      task.save();
      res.send(task);
    } else {
      res.status(404).send({ error: "Task not found" });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (task) {
      res.send(task);
    } else {
      res.status(404).send({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
