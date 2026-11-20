// CorePilot - Queue
// Custom FIFO (First In, First Out) Queue implementation for FCFS scheduling.

export default class Queue {
    constructor() {
        this.items = [];
        this.frontIndex = 0;
    }

    // Add an item to the rear of the queue.
    enqueue(item) {
        this.items.push(item);
    }

    // Remove and return the front item.
    dequeue() {
        if (this.isEmpty()) {
            return undefined;
        }

        const item = this.items[this.frontIndex];
        this.frontIndex++;

        // Reset storage when the queue becomes empty.
        if (this.frontIndex === this.items.length) {
            this.items = [];
            this.frontIndex = 0;
        }

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
        return this.size() === 0;
    }

    // Return the number of items currently in the queue.
    size() {
        return this.items.length - this.frontIndex;
    }

    // Remove all items from the queue.
    clear() {
        this.items = [];
        this.frontIndex = 0;
    }

    // Return the current queue items from front to rear.
    toArray() {
        return this.items.slice(this.frontIndex);
    }
}
