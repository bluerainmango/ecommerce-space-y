const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");

const User = require("../models/userModel");
const Booking = require("../models/bookingModel");
const catchAsync = require("../util/catchAsync");
const ErrorFactory = require("../util/ErrorFactory");
const Email = require("../util/email");

//! used for sign in, sign up
const createAndSendToken = async (user, req, res, statusCode) => {
  // 1) create token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    // sameSite: "none",
  };

  user.password = undefined;

  await User.findByIdAndUpdate(
    user.id,
    {
      lastLoginAt: Date.now(),
      jwtExpiresAt: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
    },
    {
      new: true,
    }
  );

  // console.log("🎃 updated User with jwtCreatedAt: ", updatedUser);

  // 2) send token via cookie
  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    message: "Successfully logged in.",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { username, email, role, password, passwordConfirm } = req.body;

  const newUser = await User.create({
    username,
    email,
    role,
    password,
    passwordConfirm,
  });

  createAndSendToken(newUser, req, res, 201);
});

exports.signin = catchAsync(async (req, res, next) => {
  const { password, username } = req.body;

  if (!password || !username)
    return next(new ErrorFactory(400, "Please provide password and username"));

  const user = await User.findOne({ username }).select("+password");

  if (!user || !(await user.isCorrectPassword(password, user.password)))
    return next(new ErrorFactory(401, "Username or password is incorrect!"));

  createAndSendToken(user, req, res, 200);
});

exports.logout = (req, res) => {
  const cookieOptions = {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  };

  res.clearCookie("jwt", cookieOptions);

  res.status(200).json({
    status: "success",
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  //* 1) Check if the req has a token

  const token = req.cookies.jwt;
  // console.log("🦋 token:", token);

  if (!token)
    return next(
      new ErrorFactory(
        401,
        "You are not logged in! Please log in first to get access"
      )
    );

  //* 2) Check if the token is valid
  // decoded: {id: iat: exp:}
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //   console.log("token:", token, decoded);

  //* 3) Check if user is still existing
  const user = await User.findOne({ _id: decoded.id });
  if (!user) {
    return next(new ErrorFactory(401, "The user does not longer exist."));
  }

  //* 4) Check if pwd is changed after the token is issued
  if (
    user.passwordChangedAt &&
    parseInt(user.passwordChangedAt / 1000, 10) > decoded.iat
  ) {
    return next(
      new ErrorFactory(
        401,
        "User recently changed password. Please log in again."
      )
    );
  }

  req.user = user;
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //* 1) Get user with email
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(
      new ErrorFactory(404, "There is no user with the provided email")
    );

  //* 2) Create reset token
  const resetToken = await user.createPasswordResetToken();
  //   console.log("🥸 reset pwd token:", resetToken);

  //* 3) Send email having reset pwd api endpoint
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetpassword/${resetToken} }`;

  try {
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token was sent to your email. Please check your email.",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new ErrorFactory(
        500,
        "There was an error sending the email. Try again later!"
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const encryptedResetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // console.log("🎃", req.params.token, encryptedResetToken);

  const user = await User.findOne({
    passwordResetToken: encryptedResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new ErrorFactory(400, "Token is invalid or expired"));

  user.password = process.env.DEFAULT_PASSWORD;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: false });

  // if a change password page will be used, the following res should be changed to createSendToken() for auto login.
  res.status(200).json({
    status: "success",
    message:
      "The password has been successfully reset to 'reset1234'. Please log in and change the password.",
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //* 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  //* 2) Check if all required input are posted
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;
  if (!currentPassword || !newPassword || !newPasswordConfirm)
    return next(new ErrorFactory(400, "Please enter all required fields."));

  //* 3) Check if POSTed password is correct
  if (!(await user.isCorrectPassword(currentPassword, user.password))) {
    return next(
      new ErrorFactory(401, "The entered current password is not correct!")
    );
  }

  //* 4) If so, update password
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();

  //* 5) Log user in, send JWT
  createAndSendToken(user, req, res, 200);
});

//! Used before deleting user
exports.checkPassword = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  const user = await User.findById(req.user._id).select("+password");

  if (!password || !(await user.isCorrectPassword(password, user.password)))
    return next(new ErrorFactory(401, "Please provide the correct password!"));

  res.status(200).json({
    status: "success",
    message: "Password is matching",
  });
});

exports.deleteOneUser = catchAsync(async (req, res, next) => {
  //* 1. remove user
  await User.findByIdAndRemove(req.user._id);
  // console.log("🦁 removed user: ", removedUser);

  //* 2. remove booking
  await Booking.deleteMany({ user: req.user._id });
  // console.log("🐯 removed booking: ", removedBooking);

  res.status(200).json({
    status: "success",
    message: "Successfully deleted the user",
  });
});
