const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const usersRouter = require("./routes/usersRouter");
const postsRouter = require("./routes/postsRouter");

const app = express();

// app level middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));


// define routes
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

// global error middleware
app.use((err, req, res, next) => {
    console.error("❌❌ ", err);
    const status = err.statusCode || 500;
    const message = err.message || "something went wrong";
    res.status(status).json({ message });
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
