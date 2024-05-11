const Book = require("../schema/Book");

let nanoid;

(async () => {
  const nanoidModule = await import("nanoid");
  nanoid = nanoidModule.nanoid;
})();

async function handleModulePost(request, h, mongoose) {
  const id = nanoid(16);
  try {
    const newBook = new Book({
      ...request?.payload,
      finished: false,
      insertAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id,
    });

    await newBook.save();
    return h
      .response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      })
      .code(201);
  } catch (error) {
    if (error.name === "ValidationError") {
      return h
        .response({
          status: "fail",
          message: Object.values(error.errors)
            .map((err) => err.message)
            .join(", "),
        })
        .code(400);
    }
    return h.response("Failed to add book").code(500);
  }
}

async function handleModuleGet(req, h) {
  try {
    const books = await Book.find();
    console.log("🚀 ~ handleModuleGet ~ books:", books);
    return h
      .response({
        status: "success",
        data: books || [],
      })
      .code(200);
  } catch (error) {
    console.error(error);
  }
}

async function handleModuleGetById(req, res) {
  const { booksId } = req.params;
  try {
    const book = await Book.find({ id: booksId });
    return res
      .response({
        status: "success",
        data: {
          book: book[0],
        },
      })
      .code(200);
  } catch (error) {
    return res
      .response({
        status: "fail",
        message: "Buku tidak ditemukan",
      })
      .code(404);
  }
}

async function handleModulePut(request, h) {
  const { booksId } = request.params;
  try {
    const result = await Book.updateOne({ id: booksId }, request.payload);

    if (result.modifiedCount === 0) {
      return h
        .response({
          status: "fail",
          message: "Buku tidak ditemukan",
        })
        .code(404);
    }

    return h
      .response({
        status: "success",
        message: "Book successfully updated",
      })
      .code(200);
  } catch (error) {
    if (error.name === "ValidationError") {
      return h
        .response({
          status: "fail",
          message: Object.values(error.errors)
            .map((err) => err.message)
            .join(", "),
        })
        .code(400);
    }
  }
}

async function handleModuleDelete(req, res) {
  try {
    const book = await Book.deleteOne({ id: req.params.booksId });
    return res
      .response({
        status: "success",
        message: "Buku berhasil dihapus",
      })
      .code(200);
  } catch (error) {
    return res
      .response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
      })
      .code(500);
  }
}

module.exports = {
  handleModulePost,
  handleModuleGet,
  handleModuleGetById,
  handleModulePut,
  handleModuleDelete,
};
