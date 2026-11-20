// CorePilot - FCFS
// First Come, First Served scheduling using the custom Queue.

import Queue from "../DS/Queue.js";

export default function runFCFS(processes) {
    if (!Array.isArray(processes)) {
        throw new TypeError("Processes must be provided as an array.");
    }

    processes.forEach((process, index) => {
        if (!process || process.id === undefined || process.id === null) {
            throw new Error(`Process at index ${index} must have an id.`);
        }

        if (!Number.isFinite(process.arrivalTime) || process.arrivalTime < 0) {
            throw new Error(
                `Process ${process.id} must have a non-negative arrivalTime.`
            );
        }

        if (!Number.isFinite(process.burstTime) || process.burstTime <= 0) {
            throw new Error(
                `Process ${process.id} must have a positive burstTime.`
            );
        }
    });

    // Sort a copy so the input array stays unchanged.
    // Original index preserves input order when arrival times are equal.
    const arrivals = processes
        .map((process, index) => ({ process, index }))
        .sort((a, b) => {
            return (
                a.process.arrivalTime - b.process.arrivalTime ||
                a.index - b.index
            );
        });

    const readyQueue = new Queue();
    const timeline = [];

    let currentTime = 0;
    let nextArrivalIndex = 0;

    while (nextArrivalIndex < arrivals.length || !readyQueue.isEmpty()) {
        // If no process is ready, advance time to the next arrival.
        if (
            readyQueue.isEmpty() &&
            currentTime < arrivals[nextArrivalIndex].process.arrivalTime
        ) {
            const idleStart = currentTime;
            currentTime = arrivals[nextArrivalIndex].process.arrivalTime;

            timeline.push({
                type: "idle",
                start: idleStart,
                end: currentTime,
            });
        }

        // Add every process that has arrived to the ready queue.
        while (
            nextArrivalIndex < arrivals.length &&
            arrivals[nextArrivalIndex].process.arrivalTime <= currentTime
        ) {
            readyQueue.enqueue(arrivals[nextArrivalIndex].process);
            nextArrivalIndex++;
        }

        const process = readyQueue.dequeue();
        const start = currentTime;
        const end = start + process.burstTime;

        timeline.push({
            type: "process",
            processId: process.id,
            start,
            end,
        });

        currentTime = end;
    }

    return timeline;
}
