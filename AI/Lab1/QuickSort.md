# QuickSort Explanation

The file [QuickSort.js](QuickSort.js) defines a recursive `quickSort()` function that sorts an array using the QuickSort algorithm.

## Key Components

### 1. Input Validation
The function first checks whether the provided value is an array.

- If it is not an array, it throws a `TypeError`.
- This helps prevent invalid input from being processed.

### 2. Base Case
If the array has 0 or 1 element, it is already sorted.

- The function returns a shallow copy using `arr.slice()`.
- This stops the recursion.

### 3. Pivot Selection
The algorithm chooses the first element of the array as the `pivot`.

- The rest of the array is stored in `rest`.

### 4. Partitioning
The remaining elements are split into two groups:

- `left`: values less than or equal to the pivot
- `right`: values greater than the pivot

Each item in `rest` is compared with the pivot and placed into the correct array.

### 5. Recursive Sorting
The function sorts both halves by calling itself:

- `quickSort(left)`
- `quickSort(right)`

Then it combines the results:

- sorted left side
- pivot
- sorted right side

## How It Works

1. Pick a pivot.
2. Split the array into smaller and larger values.
3. Sort both halves recursively.
4. Merge the results into one sorted array.

## Example

For the array `[10, 7, 8, 9, 1, 5]`:

- Pivot: `10`
- Left side: `[7, 8, 9, 1, 5]`
- Right side: `[]`

The function keeps splitting the subarrays until each part has one element, then builds the final sorted array.

## Important Note

This implementation returns a new sorted array and does not modify the original array.

## Complexity

- Average time complexity: $O(n \log n)$
- Worst-case time complexity: $O(n^2)$
- Space complexity: $O(n)$
