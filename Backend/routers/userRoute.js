const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const upload = require("../middleware/multer");
const router = express.Router();

//TODO ======== Auth controller
router.post("/signup", upload.single("profilePic"), authController.signup);
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

//TODO current  normal user

//TODO   ====== Router middleware
// router.use(authController.protect);

router.patch(
  "/updatePassword",
  authController.protect,
  userController.updatePassword
);
router.patch("/updateMe", authController.protect, userController.updateMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);
router.get(
  "/me",
  authController.protect,
  userController.getMe,
  userController.getUser
);

//TODO  admin

//TODO ====== Router middleware
// router.use(restrictTo("admin"));

router.get(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  userController.getAllUsers
);

router.get(
  "/:id",
  authController.protect,
  authController.restrictTo("admin"),
  userController.getUser
);

router.patch(
  "/:id",
  authController.protect,
  authController.restrictTo("admin"),
  userController.updateUserByAdmin
);

router.delete(
  "/:id",
  authController.protect,
  authController.restrictTo("admin"),
  userController.deleteUser
);

module.exports = router;
