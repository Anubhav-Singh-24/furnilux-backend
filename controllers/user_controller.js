import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";
import RefreshToken from "../models/refresh_token.js";

dotenv.config();

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name },
    process.env.ACCESS_SECRET_KEY,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET_KEY,
    { expiresIn: "7d" }
  );
  await RefreshToken.findOneAndUpdate(
    { user: user._id },
    { token: refreshToken },
    { upsert: true, new: true }
  );
  return refreshToken;
};

const validateCaptcha = async (token) => {
  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${token}`,
      {
        method: "POST",
      }
    );
    const data = await response.json();
    if (data.success) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error("Captcha validation failed");
  }
};

export const signupUser = async (req, res) => {
  try {
    const { name, email, password,token } = req.body;
    const success = await validateCaptcha(token);
    if (!success) {
      return res.status(500).json({ msg: "Captcha Validation failed" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exist" });
    }
    const hashedPswd = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPswd });
    await newUser.save();
    return res.status(200).json({ msg: "Profile Created Successfully" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, token } = req.body;
    const success = await validateCaptcha(token);
    if (!success) {
      return res.status(500).json({ msg: "Captcha Validation failed" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User does not exist" });
    }
    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      return res.status(400).json({ msg: "Wrong password" });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: "true",
    });
    res.status(200).json({ accessToken, name: user.name });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await RefreshToken.findOneAndDelete({ token: refreshToken });
    res.clearCookie("refreshToken");
    return res.status(200).json({ msg: "User logged out" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const refreshtoken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(403).json({ msg: "Refresh token is missing" });
    }
    const refreshtokenDB = await RefreshToken.findOne({
      token: refreshToken,
    });
    if (!refreshtokenDB) {
      return res.status(403).json({ msg: "Refresh token not found" });
    }
    const decode = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
    const user = await User.findById(decode.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const newAccessToken = generateAccessToken(user);
    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json(error);
  }
};
