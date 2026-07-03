const products = require("./data");

const getProducts = () => products;

const getProduct = (_, { id }) => {
  const product = products.find((p) => p.id === id);
  if (!product) {
    const error = new Error("Product not found");
    error.code = 404;
    error.data = { id };
    throw error;
  }
  return product;
};

const addProduct = (_, { input }) => {
  const newProduct = { id: products.length + 1, ...input };
  products.push(newProduct);
  return newProduct;
};

const updateProduct = (_, { id, input }) => {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    const error = new Error("Product not found");
    error.code = 404;
    error.data = { id };
    throw error;
  }
  products[index] = { ...products[index], ...input };
  return products[index];
};

module.exports = { getProducts, getProduct, addProduct, updateProduct };
