const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const usersRouter = require("./routes/usersRouter");
const errorHandler = require("./middlewares/errorHandler");
const postsRouter = require("./routes/postsRouter");

dotenv.config();
const app = express();

// app level middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));


// define routes
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

// global error middleware
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`✅✅ Server is running on http://localhost:${PORT}`);
    mongoose.connect(process.env.DATABASE_URI).then(() => {
        console.log("✅✅ Database connected successfully");
    }).catch((err) => {
        console.log("❌❌ Database connection failed", err);
    });
});
