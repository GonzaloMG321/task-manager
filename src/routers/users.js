import express from "express";
import multer from "multer";
import sharp from "sharp";
import sendEmail, { sendCancelationMail } from "../emails/account.js";
import auth from "../middleware/auth.js";
import User from "../models/user.js";

const router = new express.Router();
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)/)) {
      return cb(new Error("The file must be an image"));
    }
    cb(undefined, true);
  },
});
router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ token, user });
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    sendEmail(user.email, user.name);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({
        width: 250,
        height: 250,
      })
      .png()
      .toBuffer();

    const user = req.user;
    user["avatar"] = buffer;
    await user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  const user = req.user;
  user.avatar = undefined;
  await user.save();
  res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user && !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(400).send({ error });
  }
});

router.post("/users/logout", auth, async (req, res) => {
  const user = req.user;

  try {
    user["tokens"] = user["tokens"].filter(
      (token) => token.token !== req.token
    );
    await user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/users/logout-all", auth, async (req, res) => {
  const user = req.user;
  try {
    user.tokens = [];
    await user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.delete("/users/me", auth, async (req, res) => {
  const { user } = req;
  try {
    await user.remove();
    sendCancelationMail(user.email, user.name);
    res.send(req.user);
  } catch (error) {
    (error) => res.status(500).send(error);
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const { body } = req;
  const updates = Object.keys(body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Field not allowed" });
  }
  try {
    const user = req.user;
    updates.forEach((update) => {
      user[update] = body[update];
    });
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/users/:id/tasks", auth, async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  await user.populate("tasks").execPopulate();
  res.send(user.tasks);
});

export default router;
