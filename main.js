// CorePilot - Main Application
// Connects the HTML interface with the scheduling and simulation modules.

import Simulator from "./Simulation/Simulator.js";
import runComparison from "./Algorithms/Comparison.js";
import runRoundRobin from "./Algorithms/RoundRobin.js";

const simulator = new Simulator();

let processes = [];
let simulation = null;
let currentStep = 0;
let playbackTimer = null;

const $ = (selector) => document.querySelector(selector);

const processForm = $("#process-form");
const processList = $("#process-list");
const processIdInput = $("#process-id");
const arrivalInput = $("#arrival-time");
const burstInput = $("#burst-time");
const priorityInput = $("#priority");
const algorithmSelect = $("#algorithm");
const quantumInput = $("#time-quantum");

const ganttChart = $("#gantt-chart");
const resultsBody = $("#simulation-results");
const comparisonBody = $("#comparison-results");

const cpuStatus = $(".cpu-status p:nth-child(1) span");
const currentProcess = $(".cpu-status p:nth-child(2) span");
const simulationTime = $(".cpu-status p:nth-child(3) span");

const averageWaiting = $(".average-metrics p:nth-child(1) span");
const averageTurnaround = $(".average-metrics p:nth-child(2) span");

const queueView = $("#queue-visualization");
const heapView = $("#heap-visualization");
const circularQueueView = $("#circular-queue-visualization");
const operationDescription = $("#operation-description");

const [startButton, pauseButton, stepButton, restartButton] =
    document.querySelectorAll(".simulation-buttons button");

const compareButton = $(".comparison-section button");

function showError(message) {
    window.alert(message);
}

function formatNumber(value) {
    return Number.isFinite(value) ? Number(value.toFixed(2)) : "--";
}

function selectedAlgorithm() {
    const values = {
        "fcfs": "FCFS",
        "priority": "Priority",
        "round-robin": "RoundRobin"
    };

    return values[algorithmSelect.value];
}

function stopPlayback() {
    if (playbackTimer !== null) {
        window.clearInterval(playbackTimer);
        playbackTimer = null;
    }
}

function clearOutput() {
    ganttChart.replaceChildren();
    resultsBody.replaceChildren();
    comparisonBody.replaceChildren();

    averageWaiting.textContent = "--";
    averageTurnaround.textContent = "--";

    cpuStatus.textContent = "Idle";
    currentProcess.textContent = "None";
    simulationTime.textContent = "0";

    queueView.replaceChildren();
    heapView.replaceChildren();
    circularQueueView.replaceChildren();

    operationDescription.textContent =
        "Run a simulation to see the data structure visualization.";
}

function renderProcessList() {
    processList.replaceChildren();

    processes.forEach((process) => {
        const row = document.createElement("tr");

        [
            process.id,
            process.arrivalTime,
            process.burstTime,
            process.priority ?? "--"
        ].forEach((value) => {
            const cell = document.createElement("td");
            cell.textContent = String(value);
            row.appendChild(cell);
        });

        processList.appendChild(row);
    });
}

function addProcess(event) {
    event.preventDefault();

    const id = processIdInput.value.trim();
    const arrivalTime = Number(arrivalInput.value);
    const burstTime = Number(burstInput.value);
    const priorityValue = priorityInput.value.trim();
    const priority = priorityValue === "" ? null : Number(priorityValue);

    if (!id) {
        showError("Please enter a process ID.");
        return;
    }

    if (processes.some((process) => String(process.id) === id)) {
        showError("That process ID already exists.");
        return;
    }

    if (arrivalInput.value === "" || !Number.isFinite(arrivalTime) || arrivalTime < 0) {
        showError("Arrival time must be zero or greater.");
        return;
    }

    if (burstInput.value === "" || !Number.isFinite(burstTime) || burstTime <= 0) {
        showError("Burst time must be greater than zero.");
        return;
    }

    if (priority !== null && !Number.isFinite(priority)) {
        showError("Priority must be a valid number.");
        return;
    }

    processes.push({ id, arrivalTime, burstTime, priority });

    renderProcessList();
    processForm.reset();
    resetForNewInput();
}

function resetForNewInput() {
    stopPlayback();
    simulation = null;
    currentStep = 0;
    clearOutput();
}

function prepareSimulation() {
    if (processes.length === 0) {
        throw new Error("Add at least one process first.");
    }

    const algorithm = selectedAlgorithm();

    if (!algorithm) {
        throw new Error("Select a scheduling algorithm.");
    }

    if (
        algorithm === "Priority" &&
        processes.some((process) => !Number.isFinite(process.priority))
    ) {
        throw new Error("Enter a valid priority for every process.");
    }

    const quantum = Number(quantumInput.value);

    if (
        algorithm === "RoundRobin" &&
        (quantumInput.value.trim() === "" || !Number.isFinite(quantum) || quantum <= 0)
    ) {
        throw new Error("Enter a positive time quantum for Round Robin.");
    }

    simulator.setProcesses(processes);
    simulator.setAlgorithm(algorithm);

    if (algorithm === "RoundRobin") {
        simulator.setTimeQuantum(quantum);
    }

    simulation = simulator.run();
    currentStep = 0;

    renderResults();
    renderTimeline();
    updatePlaybackDisplay();

    return simulation;
}

function renderResults() {
    resultsBody.replaceChildren();

    simulation.processes.forEach((process) => {
        const row = document.createElement("tr");

        [
            process.id,
            formatNumber(process.completionTime),
            formatNumber(process.turnaroundTime),
            formatNumber(process.waitingTime)
        ].forEach((value) => {
            const cell = document.createElement("td");
            cell.textContent = String(value);
            row.appendChild(cell);
        });

        resultsBody.appendChild(row);
    });

    averageWaiting.textContent =
        formatNumber(simulation.averages.averageWaitingTime);

    averageTurnaround.textContent =
        formatNumber(simulation.averages.averageTurnaroundTime);
}

function renderTimeline() {
    ganttChart.replaceChildren();

    if (!simulation) return;

    simulation.timeline.slice(0, currentStep).forEach((entry) => {
        const block = document.createElement("div");
        block.className = "gantt-block";
        block.classList.add(entry.type === "idle" ? "idle-block" : "process-block");
        block.textContent = entry.type === "idle" ? "Idle" : String(entry.processId);
        block.title = `Time ${entry.start} to ${entry.end}`;

        const label = document.createElement("small");
        label.textContent = `${entry.start} - ${entry.end}`;
        block.appendChild(label);

        ganttChart.appendChild(block);
    });
}

function updatePlaybackDisplay() {
    if (!simulation || currentStep === 0) {
        cpuStatus.textContent = "Idle";
        currentProcess.textContent = "None";
        simulationTime.textContent = "0";
        renderDSAView();
        return;
    }

    const entry = simulation.timeline[currentStep - 1];

    cpuStatus.textContent = entry.type === "idle" ? "Idle" : "Running";
    currentProcess.textContent =
        entry.type === "idle" ? "None" : String(entry.processId);
    simulationTime.textContent = String(entry.end);

    renderDSAView();
}

function renderItems(container, items, includePriority = false) {
    container.replaceChildren();

    if (items.length === 0) {
        container.textContent = "No ready processes";
        return;
    }

    items.forEach((process) => {
        const item = document.createElement("div");
        item.className = "queue-item";
        item.textContent = includePriority
            ? `${process.id} (Priority: ${process.priority})`
            : String(process.id);
        container.appendChild(item);
    });
}

// This is a conceptual ready-list view based on the timeline, not a
// frame-by-frame trace of the internal queue/heap operations.
function renderDSAView() {
    queueView.replaceChildren();
    heapView.replaceChildren();
    circularQueueView.replaceChildren();

    if (!simulation) {
        operationDescription.textContent =
            "Run a simulation to see the data structure visualization.";
        return;
    }

    const entry = currentStep > 0
        ? simulation.timeline[currentStep - 1]
        : null;

    const time = entry ? entry.end : 0;
    const algorithm = simulation.algorithm;

    const completed = new Set();

    // A process is complete only when its final execution slice has ended.
    const completionMap = new Map();
    simulation.timeline.forEach((slice) => {
        if (slice.type === "process") {
            completionMap.set(slice.processId, slice.end);
        }
    });

    processes.forEach((process) => {
        if (completionMap.get(process.id) <= time) {
            completed.add(process.id);
        }
    });

    const ready = processes.filter((process) =>
        process.arrivalTime <= time && !completed.has(process.id)
    );

    if (algorithm === "FCFS") {
        ready.sort((a, b) => a.arrivalTime - b.arrivalTime);
        renderItems(queueView, ready);
        operationDescription.textContent =
            "FCFS uses a FIFO Queue. The earliest-arriving ready process is selected first.";
    } else if (algorithm === "Priority") {
        ready.sort((a, b) =>
            a.priority - b.priority ||
            a.arrivalTime - b.arrivalTime ||
            String(a.id).localeCompare(String(b.id))
        );
        renderItems(heapView, ready, true);
        operationDescription.textContent =
            "Priority Scheduling uses a Min-Heap. A smaller priority number means higher priority.";
    } else {
        renderItems(circularQueueView, ready);
        operationDescription.textContent =
            "Round Robin uses a Circular Queue. An unfinished process returns to the rear after its time slice.";
    }
}

function advanceOneStep() {
    if (!simulation) {
        prepareSimulation();
    }

    if (currentStep >= simulation.timeline.length) {
        stopPlayback();
        return false;
    }

    currentStep++;
    renderTimeline();
    updatePlaybackDisplay();

    if (currentStep >= simulation.timeline.length) {
        stopPlayback();
    }

    return true;
}

function startSimulation() {
    try {
        if (!simulation) {
            prepareSimulation();
        }

        if (currentStep >= simulation.timeline.length) {
            showError("The simulation has finished. Press Restart to replay it.");
            return;
        }

        if (playbackTimer !== null) return;

        advanceOneStep();

        if (currentStep < simulation.timeline.length) {
            playbackTimer = window.setInterval(() => {
                advanceOneStep();
            }, 1000);
        }
    } catch (error) {
        showError(error.message);
    }
}

function pauseSimulation() {
    stopPlayback();
}

function stepSimulation() {
    try {
        stopPlayback();
        advanceOneStep();
    } catch (error) {
        showError(error.message);
    }
}

function restartSimulation() {
    stopPlayback();
    currentStep = 0;

    if (!simulation) return;

    renderTimeline();
    updatePlaybackDisplay();
}

function calculateRoundRobinMetrics(workload, timeline) {
    const completionTimes = new Map();

    timeline.forEach((entry) => {
        if (entry.type === "process") {
            completionTimes.set(entry.processId, entry.end);
        }
    });

    let totalWaiting = 0;
    let totalTurnaround = 0;

    workload.forEach((process) => {
        const completion = completionTimes.get(process.id);
        const turnaround = completion - process.arrivalTime;
        const waiting = turnaround - process.burstTime;

        totalWaiting += waiting;
        totalTurnaround += turnaround;
    });

    return {
        averageWaitingTime: totalWaiting / workload.length,
        averageTurnaroundTime: totalTurnaround / workload.length
    };
}

function renderComparison(results) {
    comparisonBody.replaceChildren();

    results.forEach((result) => {
        const row = document.createElement("tr");

        [
            result.algorithm,
            formatNumber(result.averageWaitingTime),
            formatNumber(result.averageTurnaroundTime)
        ].forEach((value) => {
            const cell = document.createElement("td");
            cell.textContent = String(value);
            row.appendChild(cell);
        });

        comparisonBody.appendChild(row);
    });
}

function compareAlgorithms() {
    try {
        if (processes.length === 0) {
            throw new Error("Add processes before comparing algorithms.");
        }

        if (processes.some((process) => !Number.isFinite(process.priority))) {
            throw new Error("Every process needs a priority for comparison.");
        }

        const workload = processes.map((process) => ({ ...process }));
        const results = runComparison(workload);

        const quantum = Number(quantumInput.value);

        if (
            quantumInput.value.trim() === "" ||
            !Number.isFinite(quantum) ||
            quantum <= 0
        ) {
            throw new Error("Enter a positive time quantum to compare Round Robin.");
        }

        const rrTimeline = runRoundRobin(workload, quantum);
        const rrMetrics = calculateRoundRobinMetrics(workload, rrTimeline);

        results.push({
            algorithm: "Round Robin",
            ...rrMetrics
        });

        renderComparison(results);
    } catch (error) {
        showError(error.message);
    }
}

// Event listeners
processForm.addEventListener("submit", addProcess);
startButton.addEventListener("click", startSimulation);
pauseButton.addEventListener("click", pauseSimulation);
stepButton.addEventListener("click", stepSimulation);
restartButton.addEventListener("click", restartSimulation);
compareButton.addEventListener("click", compareAlgorithms);

algorithmSelect.addEventListener("change", () => {
    resetForNewInput();
});

// Initial UI state
renderProcessList();
clearOutput();

console.log("CorePilot initialized.");
