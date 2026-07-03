const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema");
const resolvers = require("./resolvers");

const app = express();

app.use("/graphql", graphqlHTTP({
    schema,
    rootValue: resolvers,
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
  })
);

app.get('/', (req, res) => res.send("welcome to my api"));

app.listen(4000, () => console.log("http://localhost:4000/graphql"));
