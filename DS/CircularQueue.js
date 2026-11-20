// CorePilot - Circular Queue
// Custom Circular Queue implementation for Round Robin scheduling.

export default class CircularQueue {
    constructor(capacity) {
        if (!Number.isInteger(capacity) || capacity <= 0) {
            throw new Error("Capacity must be a positive integer.");
        }

        this.items = new Array(capacity);
        this.capacity = capacity;
        this.frontIndex = 0;
        this.rearIndex = 0;
        this.count = 0;
    }

    // Add an item to the rear of the queue.
    enqueue(item) {
        if (this.isFull()) {
            return false;
        }

        this.items[this.rearIndex] = item;
        this.rearIndex = (this.rearIndex + 1) % this.capacity;
        this.count++;

        return true;
    }

    // Remove and return the front item.
    dequeue() {
        if (this.isEmpty()) {
            return undefined;
        }

        const item = this.items[this.frontIndex];
        this.items[this.frontIndex] = undefined;
        this.frontIndex = (this.frontIndex + 1) % this.capacity;
        this.count--;

        return item;
    }

    // Return the front item without removing it.
    peek() {
        if (this.isEmpty()) {
            return undefined;
        }

        return this.items[this.frontIndex];
    }

    // Check whether the queue has no items.
    isEmpty() {
        return this.count === 0;
    }

    // Check whether the queue is at capacity.
    isFull() {
        return this.count === this.capacity;
    }

    // Return the number of items currently in the queue.
    size() {
        return this.count;
    }

    // Remove all items from the queue.
    clear() {
        this.items = new Array(this.capacity);
        this.frontIndex = 0;
        this.rearIndex = 0;
        this.count = 0;
    }

    // Return the current queue items from front to rear.
    toArray() {
        const result = [];

        for (let i = 0; i < this.count; i++) {
            result.push(this.items[(this.frontIndex + i) % this.capacity]);
        }

        return result;
    }
}
