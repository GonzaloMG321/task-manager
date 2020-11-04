import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.plugin(paginate);

const Task = mongoose.model("Task", taskSchema);

export default Task;
