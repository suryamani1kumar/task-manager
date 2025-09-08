import jwt from "jsonwebtoken";

export const generateTokens = (payload, time, refreshTime) => {
  const accessToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: time } // short life
  );

  const refreshToken = jwt.sign(payload,
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: refreshTime } // long life
  );
  return { accessToken, refreshToken };
};
