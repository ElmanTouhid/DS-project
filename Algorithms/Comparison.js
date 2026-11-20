// CorePilot - Algorithm Comparison
// Compare scheduling algorithms using the same process workload.

import runFCFS from "./FCFS.js";
import runPriority from "./Priority.js";

function calculateMetrics(processes, timeline) {
    const completionTimes = new Map();

    timeline.forEach((entry) => {
        if (entry.type === "process") {
            completionTimes.set(entry.processId, entry.end);
        }
    });

    const processMetrics = processes.map((process) => {
        const completionTime = completionTimes.get(process.id);
        const turnaroundTime = completionTime - process.arrivalTime;
        const waitingTime = turnaroundTime - process.burstTime;

        return {
            processId: process.id,
            completionTime,
            turnaroundTime,
            waitingTime,
        };
    });

    const processCount = processMetrics.length;

    const totalWaitingTime = processMetrics.reduce(
        (total, process) => total + process.waitingTime,
        0
    );

    const totalTurnaroundTime = processMetrics.reduce(
        (total, process) => total + process.turnaroundTime,
        0
    );

    return {
        processMetrics,
        averageWaitingTime:
            processCount === 0 ? 0 : totalWaitingTime / processCount,
        averageTurnaroundTime:
            processCount === 0 ? 0 : totalTurnaroundTime / processCount,
    };
}

export default function runComparison(processes) {
    if (!Array.isArray(processes)) {
        throw new TypeError("Processes must be provided as an array.");
    }

    const algorithms = [
        { name: "FCFS", run: runFCFS },
        { name: "Priority", run: runPriority },
    ];

    return algorithms.map(({ name, run }) => {
        const timeline = run(processes);
        const metrics = calculateMetrics(processes, timeline);

        return {
            algorithm: name,
            timeline,
            ...metrics,
        };
    });
}
