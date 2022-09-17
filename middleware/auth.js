import jwt from "jsonwebtoken";
import { UnAuthenticatedError } from "../errors/index.js";

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  console.log("authHeader");

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    // console.log(authHeader);
    // console.log("no auth header or authheader with bearer");
    throw new UnAuthenticatedError("Authentication Invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId };

    next();
  } catch (error) {
    throw new UnAuthenticatedError("Authentication Invalid");
  }
};

export default auth;
