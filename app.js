/** @format */

require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//My Routes
const authRoutes = require("./routes/auth");
const itemRouters = require("./routes/item");
const userRouters = require("./routes/user");
const paymantRouters = require("./routes/payment");

//Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use("/api/uploads", express.static("uploads"));

//Set headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//My Routes
app.use("/api", authRoutes);
app.use("/api", itemRouters);
app.use("/api", userRouters);
app.use("/api", paymantRouters);

//Error MiddleWare

app.use((error, req, res, next) => {
  console.log(error + "-----------------------------");
  const statusCode = error.statusCode || 500;
  const message = error.message;
  let errorsPresent;
  if (error.errors) {
    errorsPresent = error.errors;
  }

  res.status(statusCode).json({
    message: message,
    errors: errorsPresent,
  });
  next();
});

//My Port
const port = process.env.PORT || 8000;

const clients = {};

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB CONNECTED");
    const server = app.listen(port, () => {
      console.log("Server is running on port 8000");
    });
    const io = require("./util/socket").init(server);
    io.on("connection", (socket) => {
      socket.on("add-user", (data) => {
        clients[data.userId] = {
          socket: socket.id,
        };
      });

      socket.on("disconnect", () => {
        for (const userId in clients) {
          if (clients[userId].socket === socket.id) {
            delete clients[userId];
            break;
          }
        }
      });
    });
  })
  .catch((err) => console.log(err));

exports.clients = clients;
