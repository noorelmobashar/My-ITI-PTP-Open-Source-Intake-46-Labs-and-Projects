const { mergeSort } = require('./sortingAlgorithms');

module.exports = mergeSort;
module.exports.mergeSort = mergeSort;

if (require.main === module) {
  const sample = [10, 7, 8, 9, 1, 5];
  console.log(mergeSort(sample));
}
