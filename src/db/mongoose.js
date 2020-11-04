import mongoose from "mongoose";

const url = process.env.MONGDB_URL;

mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

export default mongoose;
