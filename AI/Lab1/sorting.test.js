const test = require('node:test');
const assert = require('node:assert/strict');

const quickSort = require('./QuickSort');
const mergeSort = require('./MergeSort');
const heapSort = require('./HeapSort');
const insertionSort = require('./InsertionSort');
const selectionSort = require('./SelectionSort');
const bubbleSort = require('./BubbleSort');
const builtInSort = require('./BuiltInSort');
const parallelQuickSort = require('./ParallelQuickSort');

const algorithms = [
  { name: 'QuickSort', sort: quickSort, errorMessage: 'quickSort expects an array' },
  { name: 'MergeSort', sort: mergeSort, errorMessage: 'mergeSort expects an array' },
  { name: 'HeapSort', sort: heapSort, errorMessage: 'heapSort expects an array' },
  { name: 'InsertionSort', sort: insertionSort, errorMessage: 'insertionSort expects an array' },
  { name: 'SelectionSort', sort: selectionSort, errorMessage: 'selectionSort expects an array' },
  { name: 'BubbleSort', sort: bubbleSort, errorMessage: 'bubbleSort expects an array' },
  { name: 'BuiltInSort', sort: builtInSort, errorMessage: 'builtInSort expects an array' },
];

const sample = [10, 7, 8, 9, 1, 5, 5, 0, -3];
const sortedSample = [-3, 0, 1, 5, 5, 7, 8, 9, 10];

test('sorting algorithms sort numbers in ascending order', () => {
  for (const { name, sort } of algorithms) {
    const input = sample.slice();
    const output = sort(input);

    assert.deepEqual(output, sortedSample, name + ' should sort correctly');
  }
});

test('sorting algorithms do not mutate the original array', () => {
  for (const { name, sort } of algorithms) {
    const input = sample.slice();
    const snapshot = input.slice();

    sort(input);

    assert.deepEqual(input, snapshot, name + ' should not mutate the input array');
  }
});

test('sorting algorithms handle empty and single-item arrays', () => {
  for (const { name, sort } of algorithms) {
    assert.deepEqual(sort([]), [], name + ' should handle empty arrays');
    assert.deepEqual(sort([42]), [42], name + ' should handle single-item arrays');
  }
});

test('sorting algorithms throw on invalid input', () => {
  for (const { name, sort, errorMessage } of algorithms) {
    assert.throws(() => sort(null), { name: 'TypeError', message: errorMessage }, name + ' should reject null');
    assert.throws(() => sort('not-an-array'), { name: 'TypeError', message: errorMessage }, name + ' should reject strings');
  }
});

test('sorting algorithms export callable functions', () => {
  for (const { sort } of algorithms) {
    assert.equal(typeof sort, 'function');
  }
});

test('parallelQuickSort sorts numbers in ascending order', async () => {
  const input = sample.slice();
  const output = await parallelQuickSort(input, {
    maxDepth: 2,
    minPartitionSize: 2,
    parallelism: 2,
  });

  assert.deepEqual(output, sortedSample);
  assert.deepEqual(input, sample);
});

test('parallelQuickSort throws on invalid input', async () => {
  await assert.rejects(
    () => parallelQuickSort(null),
    { name: 'TypeError', message: 'parallelQuickSort expects an array' },
  );
});
