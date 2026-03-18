const test = require('node:test');
const assert = require('node:assert/strict');

const { handleApiRoute } = require('./server');

test('GET /api/algorithms lists available algorithms including parallel QuickSort', async () => {
  const response = await handleApiRoute('GET', '/api/algorithms');

  assert.equal(response.statusCode, 200);
  const payload = response.payload;
  assert.ok(Array.isArray(payload.algorithms));
  assert.ok(payload.algorithms.some((entry) => entry.id === 'parallel-quick-sort'));
});

test('POST /api/quicksort sorts an array', async () => {
  const response = await handleApiRoute('POST', '/api/quicksort', {
      numbers: [9, 3, 7, 1],
      parallel: true,
  });
  const payload = response.payload;

  assert.equal(response.statusCode, 200);
  assert.deepEqual(payload.sorted, [1, 3, 7, 9]);
  assert.equal(payload.algorithm, 'parallel-quick-sort');
});

test('POST /api/sort runs the requested algorithm', async () => {
  const response = await handleApiRoute('POST', '/api/sort', {
    algorithm: 'merge-sort',
    numbers: [4, 2, 8, 1],
  });

  const payload = response.payload;

  assert.equal(response.statusCode, 200);
  assert.equal(payload.algorithm.id, 'merge-sort');
  assert.deepEqual(payload.sorted, [1, 2, 4, 8]);
});
