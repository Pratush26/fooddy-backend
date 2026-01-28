// models/user.js
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true },
    photo: { type: String, required: true },
    role: { type: String, default: "user" },
    refreshToken: { type: String },
  },
  { timestamps: true }
);


userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, name: this.name, photo: this.photo, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const User = mongoose.model("User", userSchema);