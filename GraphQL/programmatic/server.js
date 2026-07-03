const express = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const schema = require("./schema");

const app = express();



app.all("/graphql", createHandler({
  schema,
  graphiql: true,
  formatError: (err) => {
    if (err.originalError) {
      const error = err.originalError;
      return {
        code: error.code,
        data: error.data,
      };
    }
    return err;
  },
}));

app.get('/', (req, res) => res.send("welcome to my api"));

app.listen(4001, () => console.log("http://localhost:4001"));
