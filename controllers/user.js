import { connectDB } from "../lib/connectDB.js";
import { User } from "../models/user.js";

export const registerUser = async (req, res) => {
    try {
        await connectDB();
        const { name, email, password, photo, phone, address } = req.body;

        if (!name || !email || !password || !photo)
            return res.status(400).json({ message: "All fields are required" });

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(409).json({ message: "User already exists" });

        const user = await User.create({ name, email, password, photo, phone, address });

        return res.status(201).json({ user, message: "User registered successfully" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const updateUser = (req, res) => {
    res.json({ success: true, message: "Express app is running 🚀" });
};

export const loginUser = async (req, res) => {
    try {
        await connectDB();

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password is required" });
        }

        if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
            return res.status(500).json({ message: "Server misconfigured: missing token secrets" });
        }

        const user = await User.findOne({ email }).select("+password +refreshToken");
        if (!user) return res.status(404).json({ message: "User not Found!" });

        const ok = await user.isPasswordCorrect(password);
        if (!ok) return res.status(401).json({ message: "Email or password is wrong" });

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.refreshToken;

        const isProd = process.env.NODE_ENV === "production";
        const cookieOpts = {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            path: "/",
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, { ...cookieOpts, maxAge: 24 * 60 * 60 * 1000 })
            .cookie("refreshToken", refreshToken, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 })
            .json({ user: userObj, message: "User logged in successfully" });
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({
            message: "Server error",
            error: err?.message || String(err),
        });
    }
};

export const logoutUser = async (req, res) => {
  try {
    await connectDB();
    const isProd = process.env.NODE_ENV === "production";

    const cookieOpts = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    };

    // If user exists, remove refresh token from DB
    if (req.user?._id) await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

    return res
      .status(200)
      .clearCookie("accessToken", cookieOpts)
      .clearCookie("refreshToken", cookieOpts)
      .json({ message: "User logged out" });
  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    return res.status(500).json({ message: "Server error", error: err?.message || String(err) });
  }
};