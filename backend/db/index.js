import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is missing in .env");
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(uri, { dbName: "Pokemons" });
    console.log(
      `Mongo connected: ${conn.connection.host}/${conn.connection.name}`
    );
  } catch (error) {
    console.error("Mongo connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
