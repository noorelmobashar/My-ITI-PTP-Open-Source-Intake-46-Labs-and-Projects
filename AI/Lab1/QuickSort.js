const {
  quickSort: defaultQuickSort,
  quickSortInPlace,
  validateArray,
} = require('./sortingAlgorithms');

function quickSort(arr, low, high) {
  validateArray(arr, 'quickSort');

  if (low === undefined && high === undefined) {
    return defaultQuickSort(arr);
  }

  const result = arr.slice();
  const start = low === undefined ? 0 : low;
  const end = high === undefined ? result.length - 1 : high;

  return quickSortInPlace(result, start, end);
}

module.exports = quickSort;
module.exports.quickSort = quickSort;

if (require.main === module) {
  const sample = [10, 7, 8, 9, 1, 5];
  console.log(quickSort(sample));
}
