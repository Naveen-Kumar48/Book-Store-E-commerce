const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter the name"],
    minLength: [5, "Please enter the name more than 4 characters"],
    maxLength: [40, "Please enter the name less than  40 characters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please enter the email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please enter the email proper format"],
  },
  role: {
    type: String,
    enum: ["user", "author", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please enter the password"],
    minLength: [8, "Please enter the password more than 7 characters"],
    trim: true,
    select: false,
  },
  confirmPassword: {
    type: String,
    validate: {
      validator: function (pass) {
        return pass === this.password;
      },
      message: "password and confirmPassword are not same",
    },
  },
  profilePic: String,
  otp: Number,
  otpExpires: Date,
  isVerified: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function () {
  console.log(this.isModified("password"));
  // this.isModified("password") it returns true if the password is not modified
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});

userSchema.methods.checkPassword = async function (userpassword, dbPassword) {
  return await bcrypt.compare(userpassword, dbPassword);
};

// Hide Deleted Users Automatically
// userSchema.pre(/^find/, function (next) {
//   this.find({ active: { $ne: false } });
//   next();
// });

const User = model("Users", userSchema);

module.exports = User;
