import { generateTokens } from "../middleware/authToken.js";
import User from "../models/user.models.js";
import { validationResult } from "express-validator";

export const loginController = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);

    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = generateTokens(
      { id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_TIME,
      process.env.REFRESH_TOKEN_TIME
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });
    res.status(201).json({
      user: { id: user._id, email: user.email, fullName: user.fullName },
      token: { accessToken, refreshToken },
    });
  } catch (e) {
    next(e);
  }
};

export const registerController = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password, fullName } = req.body;
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({ email, password, fullName });

    const { accessToken, refreshToken } = generateTokens(
      { id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_TIME,
      process.env.REFRESH_TOKEN_TIME
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });

    res.status(201).json({
      user: { id: user._id, email: user.email, fullName: user.fullName },
      token: { accessToken, refreshToken },
    });
  } catch (e) {
    next(e);
  }
};
