const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type Product {
    id: Int!
    name: String!
    price: Float!
    categoryId: Int!
  }

  input ProductInput {
    name: String!
    price: Float!
    categoryId: Int!
  }

  input ProductUpdateInput {
    name: String
    price: Float
    categoryId: Int
  }

  type Query {
    products: [Product]
    product(id: Int!): Product
  }

  type Mutation {
    addProduct(input: ProductInput!): Product
    updateProduct(id: Int!, input: ProductUpdateInput!): Product
  }
`);

module.exports = schema;
