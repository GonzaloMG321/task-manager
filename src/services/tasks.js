import Task from "../models/task.js";

const getTasks = async (req, limit = 5) => {
  const {
    completed,
    description,
    page = 1,
    sortBy = "createdAt:1",
  } = req.query;
  const match = {
    owner: req.user._id,
  };

  if (completed) {
    match["completed"] = completed === "true";
  }

  if (description) {
    match["description"] = description;
  }

  const sort = sortBy.split(",").reduce((previoBy, currentBy) => {
    const by = currentBy.split(":");
    previoBy = {
      ...previoBy,
      [by[0]]: parseInt(by[1]),
    };
    return previoBy;
  }, {});

  /*await user
          .populate({
            path: "tasks",
            match,
            options: {
              limit: limit,
              offset: 2,
            },
          })
          .execPopulate();*/
  const tasks = await Task.paginate(match, {
    limit,
    page,
    sort,
  });
  return tasks;
};

export { getTasks };
