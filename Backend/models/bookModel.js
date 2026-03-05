const { Schema, model, default: mongoose } = require("mongoose");

const bookSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please enter the title"],
    trim: true,
    lowercase: true,
    minLength: [6, "Title should be greater than or equal to 6"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Please enter the description"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Please enter the Price"],
    min: 0,
  },
  discount: {
    type: Number,
    // Custom validation: must be a regular function to access 'this'
    validate: {
      validator: function (discountValue) {
        return discountValue < this.price;
      },
      message: "Discount ({VALUE}) must be less than the price",
    },
  },
  authorNames: {
    type: [String],
    required: true, // Optional: added based on your data example
  },
  genre: {
    type: String,
    required: true,
    enum: {
      values: [
        "fantasy",
        "science_fiction",
        "mystery",
        "romance",
        "horror",
        "historical_fiction",
        "self_help",
        "biography",
      ],
      message: "Genre `{VALUE}` is not supported",
    },
  },
  bookImage: {
    type: String,
    required: [true, "Book image URL is required"], // Added based on your data
  },
  publishedData: {
    type: Date,
  },
  isAvaliable: {
    type: Boolean,
    default: true,
  },
  stock: {
    type: Number,
    min: 0,
    required: true, // Added based on your data
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Explicitly using Types.ObjectId
    ref: "Users",
    required: true,
  },
});

const Book = model("Books", bookSchema);

module.exports = Book;
