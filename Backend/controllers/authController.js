const jwt = require("jsonwebtoken");
const { promisify } = require("node:util");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { generateOTP } = require("../utils/otpGeneration");
const { sendEmail } = require("../middleware/email.js");
const { signToken } = require("../middleware/signToken.js");
const { maskEmail } = require("../utils/emailMasking");

const createSendToken = (user, statusCode, res) => {
  const token = signToken({ id: user._id });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // 🔐 cannot be accessed by JS
  };

  // for production (HTTPS
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword, role } = req.body;

  const otp = generateOTP();
  const profilePic = req.file ? req.file.path : undefined;

  let user = await User.findOne({ email });

  if (user) {
    if (user.isVerified) {
      return next(new AppError("User already verified. Please login", 400));
    }
    // Update existing unverified user
    user.name = name;
    user.password = password;
    user.confirmPassword = confirmPassword;
    user.role = role;
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min
    if (profilePic) user.profilePic = profilePic;

    await user.save();
  } else {
    // Create new user
    user = await User.create({
      name,
      email,
      password,
      confirmPassword,
      profilePic,
      role,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });
  }

  try {
    await sendEmail(email, otp);
  } catch (err) {
    if (user.isNew) {
      await User.findByIdAndDelete(user._id);
    } else {
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save({ validateBeforeSave: false });
    }
    return next(new AppError("There was an error sending the email. Try again later!", 500));
  }

  res.status(201).json({
    status: "success",
    message: `OTP sent to ${maskEmail(email)}`,
  });
});

exports.verifyOtp = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  console.log(`[VERIFY OTP] Request for ${email}, OTP: ${otp}`);

  if (!email || !otp) {
    return next(new AppError("Email and OTP are required", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    console.log(`[VERIFY OTP] User not found for email: ${email}`);
    return next(new AppError("User not found", 404));
  }

  const currentTime = Date.now();
  const otpExpiry = user.otpExpires ? user.otpExpires.getTime() : 0;

  console.log(`[VERIFY OTP] Stored OTP: ${user.otp}, Expiry: ${otpExpiry}, Current: ${currentTime}`);

  // Check if OTP matches (convert both to strings to be safe)
  if (!user.otp || String(user.otp) !== String(otp)) {
    console.log(`[VERIFY OTP] Mismatch! Stored: ${user.otp}, Received: ${otp}`);
    return next(new AppError("Invalid OTP", 400));
  }

  // Check if Expired
  if (otpExpiry < currentTime) {
    console.log(`[VERIFY OTP] Expired! Expiry: ${otpExpiry} < Current: ${currentTime}`);
    return next(new AppError("OTP expired", 400));
  }

  // Success
  console.log(`[VERIFY OTP] Success! Verifying user...`);
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;

  // Save with validation skipped to avoid confirmPassword issues on partial updates
  await user.save({ validateBeforeSave: false });

  createSendToken(user, 200, res);
});

exports.resendOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Email is required", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  if (user.isVerified) {
    return next(new AppError("User already verified. Please login", 400));
  }
  // generate new OTP
  const otp = generateOTP();

  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save();

  await sendEmail(email, otp);

  res.status(200).json({
    status: "success",
    message: `OTP sent to ${maskEmail(email)}`,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("please provide the email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError("Invalid  email or password", 401));
  }

  if (!user.isVerified) {
    return next(new AppError("Please verify OTP before login", 401));
  }

  // const token = signToken({ id: user._id });

  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     user,
  //     token,
  //   },
  // });
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError(`You are not logged in !. please login to get Access`, 401)
    );
  }

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decode);
  const currentUser = await User.findById(decode.id);
  // console.log(currentUser);

  if (!currentUser) {
    return next(
      new AppError("the user belonging to this token dose no longer exist", 401)
    );
  }
  req.user = currentUser;
  // console.log(req.user);
  next();
});

// login --t---> deleted my account  --books

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `you do not have the permission to perform this action`,
          403
        )
      );
    }
    next();
  };
};

exports.logout = (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};
