const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  finished: Boolean,
  insertAt: Date,
  updatedAt: Date,
  id: String,
  name: {
    type: String,
    required: [true, "Mohon isi nama buku"],
  },
  year: Number,
  summary: String,
  publisher: String,
  pageCount: {
    type: Number,
    required: [true, "Mohon isi jumlah halaman"],
  },
  readPage: {
    type: Number,
    required: [true, "Mohon isi jumlah halaman yang sudah dibaca"],
    validate: {
      validator: function (v) {
        return v <= this.pageCount;
      },
      message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    },
  },
  reading: Boolean,
});

const Book = mongoose.model("book", bookSchema);

module.exports = Book;
