const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInputObjectType,
} = require("graphql");

const { getProducts, getProduct, addProduct, updateProduct } = require("./resolvers");

const ProductType = new GraphQLObjectType({
  name: "Product",
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    price: { type: GraphQLFloat },
    categoryId: { type: GraphQLInt },
  },
});

const ProductInputType = new GraphQLInputObjectType({
  name: "ProductInput",
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    price: { type: new GraphQLNonNull(GraphQLFloat) },
    categoryId: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

const ProductUpdateInputType = new GraphQLInputObjectType({
  name: "ProductUpdateInput",
  fields: {
    name: { type: GraphQLString },
    price: { type: GraphQLFloat },
    categoryId: { type: GraphQLInt },
  },
});

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    products: {
      type: new GraphQLList(ProductType),
      resolve: getProducts,
    },
    product: {
      type: ProductType,
      args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
      resolve: getProduct,
    },
  },
});

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addProduct: {
      type: ProductType,
      args: { input: { type: new GraphQLNonNull(ProductInputType) } },
      resolve: addProduct,
    },
    updateProduct: {
      type: ProductType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        input: { type: new GraphQLNonNull(ProductUpdateInputType) },
      },
      resolve: updateProduct,
    },
  },
});

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

module.exports = schema;
