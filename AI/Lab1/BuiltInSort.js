const { builtInSort } = require('./sortingAlgorithms');

module.exports = builtInSort;
module.exports.builtInSort = builtInSort;

if (require.main === module) {
  const sample = [10, 7, 8, 9, 1, 5];
  console.log(builtInSort(sample));
}
