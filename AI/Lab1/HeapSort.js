const { heapSort } = require('./sortingAlgorithms');

module.exports = heapSort;
module.exports.heapSort = heapSort;

if (require.main === module) {
  const sample = [10, 7, 8, 9, 1, 5];
  console.log(heapSort(sample));
}
