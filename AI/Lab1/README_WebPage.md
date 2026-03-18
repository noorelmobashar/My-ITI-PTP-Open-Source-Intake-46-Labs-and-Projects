# Sorting Lab Web App

This project is now an interactive sorting playground with:

- multiple browser-side sorting algorithms
- user-selectable sorting modes
- a canvas-based visualization
- a worker-thread QuickSort API
- automated tests for the algorithms and API routing

## Included Algorithms

- Quick Sort
- Parallel Quick Sort (REST API)
- Merge Sort
- Heap Sort
- Insertion Sort
- Selection Sort
- Bubble Sort
- Built-in Sort

## Run the App

```bash
npm start
```

Then open `http://127.0.0.1:3000`.

## Run the Tests

```bash
npm test
```

## REST API

- `GET /api/algorithms`
- `POST /api/quicksort`
- `POST /api/sort`

Example request body for `POST /api/sort`:

```json
{
  "algorithm": "merge-sort",
  "numbers": [5, 3, 1, 9]
}
```
