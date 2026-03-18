const { insertionSort } = require('./sortingAlgorithms');

module.exports = insertionSort;
module.exports.insertionSort = insertionSort;

if (require.main === module) {
  const sample = [10, 7, 8, 9, 1, 5];
  console.log(insertionSort(sample));
}
