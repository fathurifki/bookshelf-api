let nanoid;

(async () => {
  const nanoidModule = await import("nanoid");
  nanoid = nanoidModule.nanoid;
})();

let books = [];

async function handleModulePost(request, h) {
  if (
    !request.payload.name ||
    (request.payload.readPage &&
      request.payload.readPage > request.payload.pageCount)
  ) {
    return h
      .response({
        status: "fail",
        message: !request.payload.name
          ? "Gagal menambahkan buku. Mohon isi nama buku'"
          : "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  }

  const id = nanoid(16);
  try {
    const newBook = {
      ...request.payload,
      finished: false,
      insertedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id,
    };

    books.push(newBook);
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
    console.error(error);
    return h.response("Gagal menambahkan buku").code(500);
  }
}

async function handleModuleGet(req, h) {
  try {
    return h
      .response({
        status: "success",
        data: {
          books: books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);
  } catch (error) {
    console.error(error);
  }
}

async function handleModuleGetById(req, res) {
  const book = books.find((book) => book.id === req.params.booksId);
  if (!book) {
    return res
      .response({
        status: "fail",
        message: "Buku tidak ditemukan",
      })
      .code(404);
  }

  return res
    .response({
      status: "success",
      data: {
        book: book
      },
    })
    .code(200);
}

async function handleModulePut(request, h) {
  const index = books.findIndex((book) => book.id === request.params.booksId);
  if (index === -1) {
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
      })
      .code(400);
  }

  if (
    !request.payload.name ||
    (request.payload.readPage &&
      request.payload.readPage > request.payload.pageCount)
  ) {
    return h
      .response({
        status: "fail",
        message: !request.payload.name
          ? "Nama buku diperlukan."
          : "Jumlah halaman yang dibaca tidak boleh lebih dari jumlah halaman total.",
      })
      .code(400);
  }

  books[index] = {
    ...books[index],
    ...request.payload,
    updatedAt: new Date().toISOString(),
  };

  return h
    .response({
      status: "success",
      message: "Buku berhasil diperbarui",
    })
    .code(200);
}

async function handleModuleDelete(req, res) {
  const index = books.findIndex((book) => book.id === req.params.booksId);
  if (index === -1) {
    return res
      .response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
      })
      .code(404);
  }

  books.splice(index, 1);
  return res
    .response({
      status: "success",
      message: "Buku berhasil dihapus",
    })
    .code(200);
}

module.exports = {
  handleModulePost,
  handleModuleGet,
  handleModuleGetById,
  handleModulePut,
  handleModuleDelete,
};
