// CorePilot - Min Heap
// Custom Min-Heap implementation for Priority Scheduling.

export default class MinHeap {
    constructor() {
        this.heap = [];
    }

    // Return the index of the parent node.
    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    // Return the index of the left child.
    getLeftChildIndex(index) {
        return 2 * index + 1;
    }

    // Return the index of the right child.
    getRightChildIndex(index) {
        return 2 * index + 2;
    }

    // Swap two elements in the heap.
    swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] =
            [this.heap[index2], this.heap[index1]];
    }

    // Compare two processes.
    // Smaller priority comes first.
    // If priorities are equal, earlier arrival comes first.
    // If arrival times are also equal, smaller process ID comes first.
    hasHigherPriority(process1, process2) {
        if (process1.priority !== process2.priority) {
            return process1.priority < process2.priority;
        }

        if (process1.arrivalTime !== process2.arrivalTime) {
            return process1.arrivalTime < process2.arrivalTime;
        }

        return String(process1.id).localeCompare(String(process2.id)) < 0;
    }

    // Insert a process into the heap.
    insert(process) {
        this.heap.push(process);
        this.heapifyUp(this.heap.length - 1);
    }

    // Restore heap order after insertion.
    heapifyUp(index) {
        while (index > 0) {
            const parentIndex = this.getParentIndex(index);

            if (
                this.hasHigherPriority(
                    this.heap[index],
                    this.heap[parentIndex]
                )
            ) {
                this.swap(index, parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    // Return the highest-priority process without removing it.
    peek() {
        if (this.isEmpty()) {
            return undefined;
        }

        return this.heap[0];
    }

    // Remove and return the highest-priority process.
    extractMin() {
        if (this.isEmpty()) {
            return undefined;
        }

        if (this.heap.length === 1) {
            return this.heap.pop();
        }

        const minProcess = this.heap[0];

        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);

        return minProcess;
    }

    // Restore heap order after removing the root.
    heapifyDown(index) {
        const size = this.heap.length;

        while (true) {
            let highestPriorityIndex = index;

            const leftIndex = this.getLeftChildIndex(index);
            const rightIndex = this.getRightChildIndex(index);

            if (
                leftIndex < size &&
                this.hasHigherPriority(
                    this.heap[leftIndex],
                    this.heap[highestPriorityIndex]
                )
            ) {
                highestPriorityIndex = leftIndex;
            }

            if (
                rightIndex < size &&
                this.hasHigherPriority(
                    this.heap[rightIndex],
                    this.heap[highestPriorityIndex]
                )
            ) {
                highestPriorityIndex = rightIndex;
            }

            if (highestPriorityIndex === index) {
                break;
            }

            this.swap(index, highestPriorityIndex);
            index = highestPriorityIndex;
        }
    }

    // Check whether the heap is empty.
    isEmpty() {
        return this.heap.length === 0;
    }

    // Return the number of processes in the heap.
    size() {
        return this.heap.length;
    }

    // Remove all processes from the heap.
    clear() {
        this.heap = [];
    }

    // Return a copy of the heap array.
    toArray() {
        return [...this.heap];
    }
}
