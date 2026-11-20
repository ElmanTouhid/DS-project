// CorePilot - Scheduling Metrics
// Calculate process metrics from a scheduling timeline.

export default function calculateMetrics(processes, timeline) {
    if (!Array.isArray(processes)) {
        throw new TypeError("Processes must be provided as an array.");
    }

    if (!Array.isArray(timeline)) {
        throw new TypeError("Timeline must be provided as an array.");
    }

    const processIds = new Set();

    processes.forEach((process, index) => {
        if (!process || process.id === undefined || process.id === null) {
            throw new Error(`Process at index ${index} must have an id.`);
        }

        if (processIds.has(process.id)) {
            throw new Error(`Process id ${process.id} must be unique.`);
        }

        processIds.add(process.id);

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

    const completionTimes = new Map();
    let totalBusyTime = 0;
    let finalTime = 0;

    timeline.forEach((entry, index) => {
        if (
            !entry ||
            !Number.isFinite(entry.start) ||
            !Number.isFinite(entry.end) ||
            entry.end < entry.start
        ) {
            throw new Error(`Timeline entry at index ${index} is invalid.`);
        }

        finalTime = Math.max(finalTime, entry.end);

        if (entry.type === "process") {
            if (!processIds.has(entry.processId)) {
                throw new Error(
                    `Timeline contains unknown process id ${entry.processId}.`
                );
            }

            completionTimes.set(entry.processId, entry.end);
            totalBusyTime += entry.end - entry.start;
        }
    });

    const processMetrics = processes.map((process) => {
        const completionTime = completionTimes.get(process.id);

        if (completionTime === undefined) {
            throw new Error(
                `No completion time was found for process ${process.id}.`
            );
        }

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
        cpuUtilization:
            finalTime === 0 ? 0 : (totalBusyTime / finalTime) * 100,
    };
}
