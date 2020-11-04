import mongoose from "../db/mongoose.js";
import Task from "../models/task.js";
import User from "../models/user.js";
/*
User.findByIdAndUpdate("5f93df7db30a678cd6b1e58c", { age: 51 })
  .then((result) => {
    console.log(result);
    return User.countDocuments({ age: 51 });
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => console.log(error));
*/
/*
Task.findByIdAndDelete("5f9273577519889eb6f9101a")
  .then((result) => {
    console.log(result);
    return Task.countDocuments({ completed: false });
  })
  .then((result) => console.log(result));
*/
const updateAgeAndCount = async (id, age) => {
  const result = await User.findByIdAndUpdate(id, {
    age,
  });
  const count = await User.countDocuments({ age });
  return count;
};

const deleteAndCount = async (id) => {
  const result = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments();
  return { result, count };
};

/*
updateAgeAndCount("5f93d6c7227243869241020c", 27)
  .then((result) => console.log(result))
  .catch((error) => console.log(error));
*/

deleteAndCount("5f927ee18227fda4f5837e70")
  .then((result) => console.log(result))
  .catch((error) => console.log(error));
