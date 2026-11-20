// CorePilot - Simulation Engine
// Connects scheduling algorithms and calculates process metrics.

import runFCFS from "../Algorithms/FCFS.js";
import runPriority from "../Algorithms/Priority.js";
import runRoundRobin from "../Algorithms/RoundRobin.js";

export default class Simulator {
    constructor() {
        this.processes = [];
        this.timeline = [];
        this.results = [];
        this.algorithm = null;
        this.timeQuantum = null;
        this.currentTime = 0;
    }

    // Set the processes for the simulation.
    setProcesses(processes) {
        if (!Array.isArray(processes)) {
            throw new TypeError("Processes must be provided as an array.");
        }

        this.processes = processes.map(process => ({ ...process }));
        this.reset();
    }

    // Select the scheduling algorithm.
    setAlgorithm(algorithm) {
        const allowedAlgorithms = ["FCFS", "Priority", "RoundRobin"];

        if (!allowedAlgorithms.includes(algorithm)) {
            throw new Error(
                "Algorithm must be FCFS, Priority, or RoundRobin."
            );
        }

        this.algorithm = algorithm;
        this.reset();
    }

    // Set the time quantum for Round Robin.
    setTimeQuantum(timeQuantum) {
        if (!Number.isFinite(timeQuantum) || timeQuantum <= 0) {
            throw new Error("Time quantum must be a positive number.");
        }

        this.timeQuantum = timeQuantum;
        this.reset();
    }

    // Validate the process list.
    validateProcesses() {
        if (this.processes.length === 0) {
            throw new Error("At least one process is required.");
        }

        const usedIds = new Set();

        this.processes.forEach((process, index) => {
            if (
                process.id === undefined ||
                process.id === null ||
                String(process.id).trim() === ""
            ) {
                throw new Error(`Process at index ${index} needs an ID.`);
            }

            if (usedIds.has(String(process.id))) {
                throw new Error(`Duplicate process ID: ${process.id}`);
            }

            usedIds.add(String(process.id));

            if (
                !Number.isFinite(process.arrivalTime) ||
                process.arrivalTime < 0
            ) {
                throw new Error(
                    `Process ${process.id} has an invalid arrival time.`
                );
            }

            if (
                !Number.isFinite(process.burstTime) ||
                process.burstTime <= 0
            ) {
                throw new Error(
                    `Process ${process.id} has an invalid burst time.`
                );
            }

            if (
                this.algorithm === "Priority" &&
                !Number.isFinite(process.priority)
            ) {
                throw new Error(
                    `Process ${process.id} needs a valid priority.`
                );
            }
        });

        if (
            this.algorithm === "RoundRobin" &&
            (!Number.isFinite(this.timeQuantum) || this.timeQuantum <= 0)
        ) {
            throw new Error("A valid time quantum is required.");
        }

        if (!this.algorithm) {
            throw new Error("Please select a scheduling algorithm.");
        }
    }

    // Run the selected scheduling algorithm.
    run() {
        this.validateProcesses();

        const input = this.processes.map(process => ({ ...process }));

        switch (this.algorithm) {
            case "FCFS":
                this.timeline = runFCFS(input);
                break;

            case "Priority":
                this.timeline = runPriority(input);
                break;

            case "RoundRobin":
                this.timeline = runRoundRobin(input, this.timeQuantum);
                break;

            default:
                throw new Error("Unsupported scheduling algorithm.");
        }

        this.calculateMetrics();
        this.currentTime = 0;

        return this.getResults();
    }

    // Calculate completion, turnaround, and waiting times.
    calculateMetrics() {
        const completionTimes = new Map();

        this.timeline.forEach(item => {
            if (item.type === "process") {
                completionTimes.set(item.processId, item.end);
            }
        });

        this.results = this.processes.map(process => {
            const completionTime = completionTimes.get(process.id);
            const turnaroundTime =
                completionTime - process.arrivalTime;
            const waitingTime =
                turnaroundTime - process.burstTime;

            return {
                id: process.id,
                arrivalTime: process.arrivalTime,
                burstTime: process.burstTime,
                priority: process.priority ?? null,
                completionTime,
                turnaroundTime,
                waitingTime,
            };
        });

        return this.results;
    }

    // Calculate average waiting and turnaround times.
    getAverages() {
        if (this.results.length === 0) {
            return {
                averageWaitingTime: 0,
                averageTurnaroundTime: 0,
            };
        }

        const totalWaitingTime = this.results.reduce(
            (sum, process) => sum + process.waitingTime,
            0
        );

        const totalTurnaroundTime = this.results.reduce(
            (sum, process) => sum + process.turnaroundTime,
            0
        );

        return {
            averageWaitingTime:
                totalWaitingTime / this.results.length,
            averageTurnaroundTime:
                totalTurnaroundTime / this.results.length,
        };
    }

    // Calculate CPU utilization as a percentage.
    getCPUUtilization() {
        if (this.timeline.length === 0) {
            return 0;
        }

        const totalBurstTime = this.timeline.reduce((total, item) => {
            if (item.type === "process") {
                return total + (item.end - item.start);
            }

            return total;
        }, 0);

        const totalElapsedTime =
            this.timeline[this.timeline.length - 1].end -
            this.timeline[0].start;

        if (totalElapsedTime <= 0) {
            return 0;
        }

        return (totalBurstTime / totalElapsedTime) * 100;
    }

    // Return the complete simulation results.
    getResults() {
        return {
            algorithm: this.algorithm,
            timeQuantum: this.algorithm === "RoundRobin"
                ? this.timeQuantum
                : null,
            timeline: [...this.timeline],
            processes: this.results.map(process => ({ ...process })),
            averages: this.getAverages(),
            cpuUtilization: this.getCPUUtilization(),
        };
    }

    // Return the execution timeline.
    getTimeline() {
        return [...this.timeline];
    }

    // Reset the simulation results.
    reset() {
        this.timeline = [];
        this.results = [];
        this.currentTime = 0;
    }

    // Clear the entire simulation.
    clear() {
        this.processes = [];
        this.algorithm = null;
        this.timeQuantum = null;
        this.reset();
    }
}
