const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
// const mongoSanitize = require("express-mongo-sanitize");
const { xss } = require("express-xss-sanitizer");
const hpp = require("hpp");
const usersRouter = require("./routes/usersRouter");
const postsRouter = require("./routes/postsRouter");
const donationsRouter = require("./routes/donationsRouter");
const errorHandler = require("./middlewares/errorHandler");
const rateLimiter = require("./middlewares/rateLimiter");

dotenv.config();
const app = express();
app.set('trust proxy', 1);

// app level middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
// app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(rateLimiter);

// define routes
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/donations", donationsRouter);

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
