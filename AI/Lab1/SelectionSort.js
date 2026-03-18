const { selectionSort } = require('./sortingAlgorithms');

module.exports = selectionSort;
module.exports.selectionSort = selectionSort;

if (require.main === module) {
  const sample = [10, 7, 8, 9, 1, 5];
  console.log(selectionSort(sample));
}
