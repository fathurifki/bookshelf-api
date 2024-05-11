const Hapi = require("@hapi/hapi");
const mongoose = require("mongoose");
const {
  handleModuleGet,
  handleModulePost,
  handleModulePut,
  handleModuleDelete,
  handleModuleGetById,
} = require("./utils/handler");

const init = async () => {
  await mongoose
    .connect(
      "mongodb+srv://jojo:jojo123@cluster001.vqkklgh.mongodb.net/books?retryWrites=true&w=majority&appName=Cluster001",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log(err);
    });

  const server = Hapi.server({
    port: 9000,
    host: "localhost",
  });

  server.route({
    method: "GET",
    path: "/books",
    handler: handleModuleGet,
  });

  server.route({
    method: "GET",
    path: "/books/{booksId}",
    handler: handleModuleGetById,
  });

  // Define the POST route
  server.route({
    method: "POST",
    path: "/books",
    handler: handleModulePost,
  });

  server.route({
    method: "PUT",
    path: "/books/{booksId}",
    handler: handleModulePut,
  });

  server.route({
    method: "DELETE",
    path: "/books/{booksId}",
    handler: handleModuleDelete,
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
