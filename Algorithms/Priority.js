// CorePilot - Priority Scheduling
// Non-Preemptive Priority Scheduling using the custom MinHeap.

import MinHeap from "../DS/MinHeap.js";

export default function runPriority(processes) {
    if (!Array.isArray(processes)) {
        throw new TypeError("Processes must be provided as an array.");
    }

    // Validate process data.
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

        if (!Number.isFinite(process.priority)) {
            throw new Error(
                `Process ${process.id} must have a valid priority.`
            );
        }
    });

    // Sort a copy by arrival time.
    // Original order is preserved when arrival times are equal.
    const arrivals = processes
        .map((process, index) => ({ process, index }))
        .sort((a, b) => {
            return (
                a.process.arrivalTime - b.process.arrivalTime ||
                a.index - b.index
            );
        });

    const readyQueue = new MinHeap();
    const timeline = [];

    let currentTime = 0;
    let nextArrivalIndex = 0;

    while (nextArrivalIndex < arrivals.length || !readyQueue.isEmpty()) {

        // If no process is ready, CPU remains idle.
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

        // Add all processes that have arrived.
        while (
            nextArrivalIndex < arrivals.length &&
            arrivals[nextArrivalIndex].process.arrivalTime <= currentTime
        ) {
            readyQueue.insert(arrivals[nextArrivalIndex].process);
            nextArrivalIndex++;
        }

        // Select the process with the highest priority.
        const process = readyQueue.extractMin();

        const start = currentTime;
        const end = start + process.burstTime;

        timeline.push({
            type: "process",
            processId: process.id,
            start,
            end,
        });

        // Non-preemptive execution: finish the selected process.
        currentTime = end;
    }

    return timeline;
}
