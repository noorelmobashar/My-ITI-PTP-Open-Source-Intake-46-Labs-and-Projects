const os = require('node:os');
const path = require('node:path');
const { Worker } = require('node:worker_threads');

const { quickSort, validateArray } = require('./sortingAlgorithms');

const DEFAULT_MIN_PARTITION_SIZE = 2048;

function normalizeOptions(options) {
  const parallelism = Number.isInteger(options.parallelism) && options.parallelism > 0
    ? options.parallelism
    : getAvailableParallelism();
  const maxDepth = Number.isInteger(options.maxDepth) && options.maxDepth >= 0
    ? options.maxDepth
    : Math.max(1, Math.floor(Math.log2(Math.max(2, parallelism))));
  const minPartitionSize = Number.isInteger(options.minPartitionSize) && options.minPartitionSize > 0
    ? options.minPartitionSize
    : DEFAULT_MIN_PARTITION_SIZE;

  return {
    maxDepth,
    minPartitionSize,
    parallelism,
  };
}

function getAvailableParallelism() {
  if (typeof os.availableParallelism === 'function') {
    return os.availableParallelism();
  }

  return os.cpus().length;
}

function splitAroundPivot(arr) {
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = [];
  const middle = [];
  const right = [];

  for (const value of arr) {
    if (value < pivot) {
      left.push(value);
    } else if (value > pivot) {
      right.push(value);
    } else {
      middle.push(value);
    }
  }

  return { left, middle, right };
}

function shouldRunSequentially(arr, options) {
  return (
    arr.length <= 1 ||
    options.maxDepth <= 0 ||
    options.parallelism <= 1 ||
    arr.length < options.minPartitionSize
  );
}

function sortInWorker(arr, options) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, 'ParallelQuickSortWorker.js'), {
      workerData: {
        arr,
        options,
      },
    });

    worker.once('message', (message) => {
      if (message && message.error) {
        const error = new Error(message.error.message);
        error.name = message.error.name || 'Error';
        reject(error);
        return;
      }

      resolve(message.sorted);
    });

    worker.once('error', reject);
    worker.once('exit', (code) => {
      if (code !== 0) {
        reject(new Error('ParallelQuickSort worker stopped with exit code ' + code));
      }
    });
  });
}

async function parallelQuickSortInternal(arr, options) {
  if (shouldRunSequentially(arr, options)) {
    return quickSort(arr);
  }

  const { left, middle, right } = splitAroundPivot(arr);
  const nextOptions = {
    parallelism: options.parallelism,
    minPartitionSize: options.minPartitionSize,
    maxDepth: options.maxDepth - 1,
  };

  const leftIsLarger = left.length >= right.length;
  const largerPartition = leftIsLarger ? left : right;
  const smallerPartition = leftIsLarger ? right : left;

  const workerPromise = largerPartition.length >= nextOptions.minPartitionSize
    ? sortInWorker(largerPartition, nextOptions)
    : parallelQuickSortInternal(largerPartition, nextOptions);
  const smallerSorted = await parallelQuickSortInternal(smallerPartition, nextOptions);
  const largerSorted = await workerPromise;

  return leftIsLarger
    ? [...largerSorted, ...middle, ...smallerSorted]
    : [...smallerSorted, ...middle, ...largerSorted];
}

async function parallelQuickSort(arr, options = {}) {
  validateArray(arr, 'parallelQuickSort');

  const normalizedOptions = normalizeOptions(options);
  return parallelQuickSortInternal(arr.slice(), normalizedOptions);
}

module.exports = parallelQuickSort;
module.exports.parallelQuickSort = parallelQuickSort;
module.exports.DEFAULT_MIN_PARTITION_SIZE = DEFAULT_MIN_PARTITION_SIZE;
module.exports.getAvailableParallelism = getAvailableParallelism;

if (require.main === module) {
  const sample = [10, 7, 8, 9, 1, 5];
  parallelQuickSort(sample).then((sorted) => {
    console.log(sorted);
  });
}
