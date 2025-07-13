const express = require("express");
const http = require("http"); // <--- ADD THIS
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { Server } = require("socket.io"); // <--- RECOMMENDED

// Load env file
// dotenv.config({
//   path: `./utils/.${process.env.NODE_ENV || "development"}.env`,
// });

dotenv.config()

const app = express();
const server = http.createServer(app); // <--- CREATE HTTP SERVER
const io = new Server(server, {
  cors: {
    origin: "*"
    // origin: "http://localhost:5173",
    // credentials: true,
  },
});

const PORT = process.env.PORT || 4000;

// ------------------------ Middlewares ---------------------------
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------ Socket.IO ---------------------------

// setInterval(() => {
//   const userId = 1;
//   console.log("📡 Emitting invite to user:", userId);
//   io.to(userId).emit("new_invite", {
//        type: 'invite',
//     message: "You were invited to the project 'Rocket Launch'",
//   });
// }, 15000);

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Simulate invite after 15 sec
//   setInterval(() => {
//     const userId = "1"; // simulate a user ID
//     console.log("this is running")
//     io.to(userId).emit("new_invite", {
//       message: "You were invited to the project 'Rocket Launch'",
//     });
//   }, 15000);
});

app.set("io", io);
// ------------------------ Routes ---------------------------
const userRoute  = require("./routes/user.Routes");
const { paymentRoute } = require("./routes/payment.Routes");
const { taskRoute } = require("./routes/task.Routes");
const { errorHandler } = require("./middleware/error.Middleware");
const notification = require("./routes/notification.Router");
const admin = require("./routes/admin.Routes");

app.use("/api/v1/", userRoute);
app.use("/api/v1/admin", admin);
app.use("/api/v1/task/", taskRoute);
app.use("/payment/v1/", paymentRoute);
app.use("/api/v1/notification/", notification);


// ------------------------ Error Middleware ---------------------------
app.use(errorHandler);

// ------------------------ Start Server ---------------------------
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
