const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const itemRoutes = require("./routes/itemSync.routes");
const categoryRoutes = require("./routes/categorySync.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/categories", categoryRoutes);

module.exports = app;
