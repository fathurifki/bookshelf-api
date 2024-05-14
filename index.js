const Hapi = require("@hapi/hapi");
const mongoose = require("mongoose");
require('dotenv').config();


const {
  handleModuleGet,
  handleModulePost,
  handleModulePut,
  handleModuleDelete,
  handleModuleGetById,
} = require("./utils/handler");

const init = async () => {
  await mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log(err);
    });

  const server = Hapi.server({
    port: 9000,
    host: "0.0.0.0",
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
