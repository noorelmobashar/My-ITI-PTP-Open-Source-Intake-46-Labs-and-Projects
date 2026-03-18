const { bubbleSort } = require('./sortingAlgorithms');

module.exports = bubbleSort;
module.exports.bubbleSort = bubbleSort;

if (require.main === module) {
  const sample = [10, 7, 8, 9, 1, 5];
  console.log(bubbleSort(sample));
}
