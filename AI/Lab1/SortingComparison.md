# Sorting Methods Comparison

This project includes these JavaScript sorting approaches:

- [QuickSort.js](QuickSort.js)
- [ParallelQuickSort.js](ParallelQuickSort.js)
- [MergeSort.js](MergeSort.js)
- [HeapSort.js](HeapSort.js)
- [InsertionSort.js](InsertionSort.js)
- [SelectionSort.js](SelectionSort.js)
- [BubbleSort.js](BubbleSort.js)
- [BuiltInSort.js](BuiltInSort.js)

## Summary

| Algorithm | Average Time | Worst Time | Extra Space | Stable | Notes |
|---|---:|---:|---:|---|---|
| Quick Sort | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ recursion on average | No | Fast in practice with good pivot behavior |
| Parallel Quick Sort | Near Quick Sort, with worker overhead | Depends on partitions | Higher than Quick Sort | No | Server-side worker threads help on larger inputs |
| Merge Sort | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ | Yes | Predictable and stable |
| Heap Sort | $O(n \log n)$ | $O(n \log n)$ | $O(1)$ | No | Good worst-case behavior with low extra memory |
| Insertion Sort | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Yes | Great for small or nearly sorted arrays |
| Selection Sort | $O(n^2)$ | $O(n^2)$ | $O(1)$ | No | Simple, but usually slower than insertion sort |
| Bubble Sort | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Yes | Mostly useful for teaching and visualization |
| Built-in Sort | Engine-dependent | Engine-dependent | Engine-dependent | Usually yes | Best practical default in most JavaScript apps |

## Which One to Use

- Use **Built-in Sort** for most production JavaScript code.
- Use **Quick Sort** when you want a classic fast divide-and-conquer implementation.
- Use **Parallel Quick Sort** when you want to expose QuickSort through the API and take advantage of worker threads on the server.
- Use **Merge Sort** when stability matters.
- Use **Heap Sort** when you want predictable performance with low extra memory.
- Use **Insertion Sort**, **Selection Sort**, and **Bubble Sort** mainly for education, small inputs, or visualization.
