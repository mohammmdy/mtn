import jwt from "jsonwebtoken";

export const jwtMaker = (userId) => {
  return jwt.sign({ userId: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

export const jwtRefreshMaker = (userId) => {
  return jwt.sign({ userId: userId }, process.env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME,
  });
};
