const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://santhoshsanthosh40253_db_user:San%401234@cluster0.kqlcsos.mongodb.net/?appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
  console.log("MongoDB Atlas connected");
};

module.exports = connectDB;
