import UserModel from "../../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt.js";

export const signupService = async ({ fullName, email, password }) => {
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = await UserModel.create({
    fullName,
    email,
    password,
  });

  const payload = { id: user.id, role: user.role };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

export const loginService = async ({ email, password }) => {
  const user = await UserModel.findOne({ email }).select("+password +refreshToken");

  if (!user) throw new Error("Invalid credentials");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid credentials");

  const payload = { id: user.id, role: user.role };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  return { user, accessToken, refreshToken };
};

export const refreshTokenService = async (token) => {
  const user = await UserModel.findOne().select("+refreshToken");

  if (!user || user.refreshToken !== token) {
    throw new Error("Invalid refresh token");
  }

  const payload = { id: user.id, role: user.role };

  const accessToken = generateAccessToken(payload);

  return { accessToken };
};

export const logoutService = async (userId) => {
  await UserModel.findByIdAndUpdate(userId, {
    refreshToken: null,
  });
};
