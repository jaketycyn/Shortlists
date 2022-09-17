import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new BadRequestError("Please provide all values");
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      throw new BadRequestError("Email already in use");
    }

    const user = await User.create({ name, email, password });

    //compare password fix possibly check in later
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnAuthenticatedError("Invalid Credentials");
    }

    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({
      user: { email: user.email, name: user.name },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    //purposely vague info to user for security reasons
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const token = user.createJWT();
  user.password = undefined;
  res.status(StatusCodes.OK).json({ user, token });
};

const updateUser = async (req, res) => {
  console.log(req.user);
  res.send("updateUser");
};

const findUser = async (req, res) => {
  const { userIdentifier } = req.params;
  try {
    // console.log("req.params");
    // console.log(req.params);
    // console.log("req.body");
    // console.log(req.body);
    console.log("userIdentifier: " + userIdentifier);

    const foundUser = await User.findOne({ email: userIdentifier });
    console.log("foundUser: " + foundUser);
    //test res

    if (foundUser === null) {
      console.log("no user with that email found");

      res.status(StatusCodes.BAD_REQUEST).json({
        msg: "no user with that email found",
      });
    }

    if (foundUser !== null) {
      console.log("foundUser: " + foundUser);
      console.log(req.user);
      //res.send({ foundUser });

      res.status(StatusCodes.OK).json({
        foundUser,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// try {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     throw new BadRequestError("Please provide all values");
//   }

//   const userAlreadyExists = await User.findOne({ email });
//   if (userAlreadyExists) {
//     throw new BadRequestError("Email already in use");
//   }

//   const user = await User.create({ name, email, password });

//   //compare password fix possibly check in later
//   const isPasswordCorrect = await user.comparePassword(password);
//   if (!isPasswordCorrect) {
//     throw new UnAuthenticatedError("Invalid Credentials");
//   }

//   const token = user.createJWT();

//   res.status(StatusCodes.CREATED).json({
//     user: { email: user.email, name: user.name },
//     token,
//   });
// } catch (error) {
//   next(error);
// }

export { registerUser, loginUser, updateUser, findUser };
