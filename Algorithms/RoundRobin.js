
// CorePilot - Round Robin Scheduling
// Round Robin implementation using the custom CircularQueue.

import CircularQueue from "../DS/CircularQueue.js";

export default function runRoundRobin(processes, timeQuantum) {
    if (!Array.isArray(processes)) {
        throw new TypeError("Processes must be provided as an array.");
    }

    if (!Number.isFinite(timeQuantum) || timeQuantum <= 0) {
        throw new Error("Time quantum must be a positive number.");
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
    });

    if (processes.length === 0) {
        return [];
    }

    // Sort a copy by arrival time.
    // Preserve original order when arrival times are equal.
    const arrivals = processes
        .map((process, index) => ({
            process,
            index,
            remainingTime: process.burstTime,
        }))
        .sort((a, b) => {
            return (
                a.process.arrivalTime - b.process.arrivalTime ||
                a.index - b.index
            );
        });

    // Every process can enter the ready queue at most once at a time.
    const readyQueue = new CircularQueue(processes.length);
    const timeline = [];

    let currentTime = 0;
    let nextArrivalIndex = 0;

    while (
        nextArrivalIndex < arrivals.length ||
        !readyQueue.isEmpty()
    ) {
        // If no process is ready, move time to the next arrival.
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
            readyQueue.enqueue(arrivals[nextArrivalIndex]);
            nextArrivalIndex++;
        }

        // Select the process at the front of the circular queue.
        const currentProcess = readyQueue.dequeue();

        const start = currentTime;

        // Execute for one time quantum or until completion.
        const executionTime = Math.min(
            timeQuantum,
            currentProcess.remainingTime
        );

        currentTime += executionTime;
        currentProcess.remainingTime -= executionTime;

        timeline.push({
            type: "process",
            processId: currentProcess.process.id,
            start,
            end: currentTime,
        });

        // Add newly arrived processes before re-queuing
        // the unfinished process.
        while (
            nextArrivalIndex < arrivals.length &&
            arrivals[nextArrivalIndex].process.arrivalTime <= currentTime
        ) {
            readyQueue.enqueue(arrivals[nextArrivalIndex]);
            nextArrivalIndex++;
        }

        // If unfinished, send the process to the rear.
        if (currentProcess.remainingTime > 0) {
            readyQueue.enqueue(currentProcess);
        }
    }

    return timeline;
}
