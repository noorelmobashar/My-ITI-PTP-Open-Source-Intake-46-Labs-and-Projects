(function attachSortingAlgorithms(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
    return;
  }

  root.SortingAlgorithms = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, function createSortingAlgorithms() {
  function validateArray(arr, algorithmName) {
    if (!Array.isArray(arr)) {
      throw new TypeError(algorithmName + ' expects an array');
    }
  }

  function swap(arr, i, j) {
    if (i === j) {
      return;
    }

    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  function partition(arr, low, high) {
    var pivotIndex = Math.floor((low + high) / 2);
    var pivotValue = arr[pivotIndex];

    swap(arr, pivotIndex, high);

    var storeIndex = low;

    for (var i = low; i < high; i += 1) {
      if (arr[i] < pivotValue) {
        swap(arr, i, storeIndex);
        storeIndex += 1;
      }
    }

    swap(arr, storeIndex, high);
    return storeIndex;
  }

  function quickSortInPlace(arr, low, high) {
    if (low >= high) {
      return arr;
    }

    var pivotIndex = partition(arr, low, high);
    quickSortInPlace(arr, low, pivotIndex - 1);
    quickSortInPlace(arr, pivotIndex + 1, high);
    return arr;
  }

  function quickSort(arr) {
    validateArray(arr, 'quickSort');

    if (arr.length <= 1) {
      return arr.slice();
    }

    var result = arr.slice();
    return quickSortInPlace(result, 0, result.length - 1);
  }

  function merge(left, right) {
    var result = [];
    var i = 0;
    var j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        result.push(left[i]);
        i += 1;
      } else {
        result.push(right[j]);
        j += 1;
      }
    }

    while (i < left.length) {
      result.push(left[i]);
      i += 1;
    }

    while (j < right.length) {
      result.push(right[j]);
      j += 1;
    }

    return result;
  }

  function mergeSort(arr) {
    validateArray(arr, 'mergeSort');

    if (arr.length <= 1) {
      return arr.slice();
    }

    var mid = Math.floor(arr.length / 2);
    var left = mergeSort(arr.slice(0, mid));
    var right = mergeSort(arr.slice(mid));

    return merge(left, right);
  }

  function heapify(arr, size, rootIndex) {
    var largest = rootIndex;
    var left = 2 * rootIndex + 1;
    var right = 2 * rootIndex + 2;

    if (left < size && arr[left] > arr[largest]) {
      largest = left;
    }

    if (right < size && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== rootIndex) {
      swap(arr, rootIndex, largest);
      heapify(arr, size, largest);
    }
  }

  function heapSort(arr) {
    validateArray(arr, 'heapSort');

    var result = arr.slice();
    var n = result.length;

    for (var i = Math.floor(n / 2) - 1; i >= 0; i -= 1) {
      heapify(result, n, i);
    }

    for (var j = n - 1; j > 0; j -= 1) {
      swap(result, 0, j);
      heapify(result, j, 0);
    }

    return result;
  }

  function insertionSort(arr) {
    validateArray(arr, 'insertionSort');

    var result = arr.slice();

    for (var i = 1; i < result.length; i += 1) {
      var current = result[i];
      var j = i - 1;

      while (j >= 0 && result[j] > current) {
        result[j + 1] = result[j];
        j -= 1;
      }

      result[j + 1] = current;
    }

    return result;
  }

  function selectionSort(arr) {
    validateArray(arr, 'selectionSort');

    var result = arr.slice();

    for (var i = 0; i < result.length - 1; i += 1) {
      var minIndex = i;

      for (var j = i + 1; j < result.length; j += 1) {
        if (result[j] < result[minIndex]) {
          minIndex = j;
        }
      }

      swap(result, i, minIndex);
    }

    return result;
  }

  function bubbleSort(arr) {
    validateArray(arr, 'bubbleSort');

    var result = arr.slice();

    for (var end = result.length - 1; end > 0; end -= 1) {
      var swapped = false;

      for (var i = 0; i < end; i += 1) {
        if (result[i] > result[i + 1]) {
          swap(result, i, i + 1);
          swapped = true;
        }
      }

      if (!swapped) {
        break;
      }
    }

    return result;
  }

  function builtInSort(arr) {
    validateArray(arr, 'builtInSort');
    return arr.slice().sort(function numericSort(a, b) {
      return a - b;
    });
  }

  var algorithmEntries = Object.freeze([
    { id: 'quick-sort', label: 'Quick Sort', sort: quickSort, family: 'divide-and-conquer' },
    { id: 'merge-sort', label: 'Merge Sort', sort: mergeSort, family: 'divide-and-conquer' },
    { id: 'heap-sort', label: 'Heap Sort', sort: heapSort, family: 'heap-based' },
    { id: 'insertion-sort', label: 'Insertion Sort', sort: insertionSort, family: 'incremental' },
    { id: 'selection-sort', label: 'Selection Sort', sort: selectionSort, family: 'incremental' },
    { id: 'bubble-sort', label: 'Bubble Sort', sort: bubbleSort, family: 'incremental' },
    { id: 'built-in-sort', label: 'Built-in Sort', sort: builtInSort, family: 'runtime-native' },
  ]);

  function getAlgorithmById(id) {
    for (var i = 0; i < algorithmEntries.length; i += 1) {
      if (algorithmEntries[i].id === id) {
        return algorithmEntries[i];
      }
    }

    return null;
  }

  return {
    algorithmEntries: algorithmEntries,
    bubbleSort: bubbleSort,
    builtInSort: builtInSort,
    getAlgorithmById: getAlgorithmById,
    heapify: heapify,
    heapSort: heapSort,
    insertionSort: insertionSort,
    merge: merge,
    mergeSort: mergeSort,
    partition: partition,
    quickSort: quickSort,
    quickSortInPlace: quickSortInPlace,
    selectionSort: selectionSort,
    swap: swap,
    validateArray: validateArray,
  };
}));
