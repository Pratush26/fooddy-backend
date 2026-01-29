import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const DB = process.env.DB;

console.log("MONGODB_URI: ", MONGODB_URI);

let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: DB,
    });
  }

  cached.conn = await cached.promise;
  global.mongoose = cached;
  return cached.conn;
}

export { connectDB };