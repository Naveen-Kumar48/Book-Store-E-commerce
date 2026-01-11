const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
// get a user
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// {
//   name:"dharma",
//   email:"dha@gmail",
//   role:"user"
// }

// ["name", "email", "role"];
const filterObj = (obj, ...allowedFields) => {
  // ["name","email"]
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

// {
//   name:"dharma",
//   email:"dha@gmail",
// }

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Block password updates
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updatePassword",
        400
      )
    );
  }

  // 2) Filter allowed fields
  const filteredBody = filterObj(req.body, "name", "email");

  // 3) Profile pic (if using multer)
  if (req.file) {
    filteredBody.profilePic = req.file.path;
  }

  // 4) Update user
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // 1️⃣ Check required fields
  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(
      new AppError(
        "Please provide current password, new password and confirm password",
        400
      )
    );
  }

  // 2️⃣ Get current user with password
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // 3️⃣ Check current password
  const isCorrect = await user.checkPassword(currentPassword, user.password);

  if (!isCorrect) {
    return next(new AppError("Current password is incorrect", 401));
  }

  // 4️⃣ Set new password
  user.password = newPassword;
  user.confirmPassword = confirmPassword;

  await user.save(); // ✅ bcrypt middleware runs

  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { active: false },
    { new: true }
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateUserByAdmin = catchAsync(async (req, res, next) => {
  // ❌ Block password update
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError("Admin cannot update password using this route", 400)
    );
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
