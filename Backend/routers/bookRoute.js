const express = require("express");
const bookController = require("../controllers/bookController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/",
  authController.protect,
  authController.restrictTo("author", "admin"),
  bookController.createBook
);

// http://localhost:5000/api/v1/books
router.get("/", bookController.getBooks);

router.get("/:id", bookController.getBook);

router.patch(
  "/:id",
  authController.protect,
  authController.restrictTo("author", "admin"),
  bookController.updateBook
);

router.delete(
  "/:id",
  authController.protect,
  authController.restrictTo("admin"),
  bookController.deleteBook
);
module.exports = router;
