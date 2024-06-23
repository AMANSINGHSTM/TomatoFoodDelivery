import mongoose from "mongoose";

export const databaseConnect = async () => {
  await mongoose
    .connect(
      "mongodb+srv://greatStack:7296032507@cluster0.extnqw9.mongodb.net/food-delevery"
    )
    .then(() => {
      console.log("Database successfully connected");
    })

    .catch((err) => {
      console.log(`some any error not connected to database : ${err}`);
    });
};
