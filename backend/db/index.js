import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongo = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "Pokemons",
    });
    console.log(`Pokemon-Leaderboard Verbindung: ${mongo.connection.name}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
