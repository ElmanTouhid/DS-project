# CorePilot
### An Interactive CPU Process Scheduling Simulator Using Queues and Priority Queues

CorePilot is a Data Structures and Algorithms (DSA) course project that demonstrates how an operating system can decide which process gets CPU time. It simulates common CPU scheduling algorithms and makes their decisions visible through process queues, a live execution timeline, Gantt charts, and performance metrics.

The goal is to help users understand not only **which process runs next**, but also **why the scheduling algorithm selects it** and how different algorithms affect waiting time and turnaround time.

> **Project type:** DSA course project  
> **Current status:** Planning / design  
> **Scope:** Educational simulation — CorePilot does not control the computer's real CPU or schedule actual operating-system processes.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Objectives](#objectives)
- [Scheduling Algorithms](#scheduling-algorithms)
- [How CorePilot Works](#how-corepilot-works)
- [Core Features](#core-features)
- [Data Structures and DSA Concepts](#data-structures-and-dsa-concepts)
- [Performance Metrics](#performance-metrics)
- [Proposed Technology Stack](#proposed-technology-stack)
- [Team Members](#team-members)
- [Planned Development Phases](#planned-development-phases)
- [Project Scope and Limitations](#project-scope-and-limitations)

---

## Project Overview

Modern computers handle many processes that compete for CPU time. Since a CPU core can execute only one process at a time, a scheduling policy is needed to decide which ready process should execute next.

CorePilot recreates this decision-making process in an interactive environment. Users can create processes manually, generate sample workloads, choose a scheduling algorithm, and run the simulation. The application then manages process arrival, ready queues, CPU execution, and completion automatically.

The same workload can also be tested with different algorithms so users can compare their behavior and performance.

## Objectives

- Demonstrate practical applications of queues, circular queues, priority queues, and heaps.
- Simulate how processes arrive, wait, execute, and complete.
- Implement multiple CPU scheduling algorithms.
- Visualize scheduling decisions and process execution.
- Calculate standard scheduling performance metrics automatically.
- Compare algorithms using the same set of processes.
- Explain the relationship between data structures and scheduling behavior.

## Scheduling Algorithms

The planned first version includes the following algorithms:

| Algorithm | How it works | Main data structure |
|---|---|---|
| **First Come, First Served (FCFS)** | Executes ready processes in arrival order. | Queue |
| **Priority Scheduling** | Selects the highest-priority process from the ready processes. | Priority Queue / Heap |
| **Round Robin (RR)** | Gives each ready process a fixed time quantum; unfinished processes return to the back of the queue. | Circular Queue |

### Scheduling rules

To keep simulations consistent and results reproducible, the initial implementation will use these rules:

- A process cannot execute before its arrival time.
- Only one process uses the simulated CPU at a time.
- A smaller priority number represents a higher priority.
- Equal-priority processes are ordered by arrival time; if arrival times are also equal, process ID/order can be used as a deterministic tie-breaker.
- Priority Scheduling will initially be **non-preemptive**: once a process starts, it runs until completion.
- Round Robin uses a configurable time quantum.
- If no process is ready, the CPU remains idle until the next process arrives.

## How CorePilot Works

1. **Create processes:** The user enters processes manually, generates a random workload, or loads a sample scenario.
2. **Configure the workload:** Each process has an ID, arrival time, burst time, and priority.
3. **Choose an algorithm:** The user selects FCFS, Priority Scheduling, Round Robin, or comparison mode.
4. **Configure options:** For Round Robin, the user sets the time quantum.
5. **Run the simulation:** The scheduling engine automatically handles arrivals, ready queues, CPU allocation, and process completion.
6. **Watch the execution:** The interface updates process states, queue contents, the current CPU process, and the Gantt chart.
7. **Review the results:** CorePilot calculates completion time, waiting time, turnaround time, and averages.
8. **Compare algorithms:** The same workload can be run independently through multiple algorithms and their results compared.

## Core Features

### 1. Process Management

- Add and remove processes.
- Assign process ID, arrival time, burst time, and priority.
- Generate random processes automatically.
- Load predefined sample workloads.
- Validate inputs before running a simulation.

### 2. Scheduling Configuration

- Select FCFS, Priority Scheduling, or Round Robin.
- Set the Round Robin time quantum.
- Choose a single-algorithm run or compare supported algorithms.

### 3. Interactive Simulation

- Start, pause, resume, and restart a simulation.
- Advance execution step by step.
- Adjust simulation speed.
- View the currently running process and its remaining burst time.
- View ready, running, completed, and not-yet-arrived processes.
- Observe the ready queue change as processes arrive and execute.

### 4. Gantt Chart

- Display the CPU execution timeline.
- Show process IDs and start/end times.
- Represent CPU idle periods when no process is ready.
- Make preemption and repeated turns visible where applicable, especially in Round Robin.

### 5. Performance Analysis

- Calculate completion, turnaround, and waiting times.
- Display average waiting time and average turnaround time.
- Compare the results of different scheduling algorithms on the same workload.

## Data Structures and DSA Concepts

CorePilot is designed around the data structures that make the scheduling decisions possible.

| Data structure / concept | Planned use |
|---|---|
| **Queue** | Maintains the FCFS ready-process order. |
| **Circular Queue** | Cycles unfinished processes through Round Robin turns. |
| **Priority Queue** | Selects the next process according to priority. |
| **Binary Heap** | Provides an efficient implementation of the priority queue. |
| **Array / Vector** | Stores process information and simulation results. |
| **Gantt timeline / execution history** | Records the order and duration of CPU execution. |

Where appropriate, the core data structures—particularly the heap-based priority queue—will be implemented directly as part of the DSA work rather than relying only on library abstractions.

## Performance Metrics

CorePilot will calculate the following metrics for each process:

| Metric | Meaning | Formula |
|---|---|---|
| **Completion Time (CT)** | Time at which a process finishes. | Determined by the simulation |
| **Turnaround Time (TAT)** | Total time from arrival to completion. | `TAT = CT - AT` |
| **Waiting Time (WT)** | Total time spent waiting for CPU execution. | `WT = TAT - BT` |

Where:
- **AT** = Arrival Time
- **BT** = Burst Time
- **CT** = Completion Time

Average metrics:

- `Average Waiting Time = Sum of Waiting Times / Number of Processes`
- `Average Turnaround Time = Sum of Turnaround Times / Number of Processes`

The simulator may also report CPU utilization when the simulation model and workload make that metric meaningful.

## Proposed Technology Stack

The final stack will be confirmed during implementation. The current proposal is:

| Layer | Proposed technology | Responsibility |
|---|---|---|
| Scheduling engine | **C++** | Process simulation and DSA implementations |
| User interface | **HTML, CSS, JavaScript** | Process input and interactive visualization |
| Charts | **Custom Gantt chart / JavaScript charting** | Execution timeline and performance comparison |

The interface and scheduling engine will need a defined communication method. That integration approach will be selected before implementation begins.

## Team Members

| Name | GitHub | Responsibility |
|---|---|---|
| **Elman Touhid** | [@ElmanTouhid](https://github.com/ElmanTouhid) | To be finalized |
| **Towsif Mahmood** | [@towsif9o9](https://github.com/towsif9o9) | To be finalized |

Both team members are contributors to this project repository. Module ownership and individual responsibilities will be agreed upon by the team.

## Planned Development Phases

1. **Requirements and design** — confirm features, scheduling rules, interface flow, and team responsibilities.
2. **Core data structures** — implement and test Queue, Circular Queue, and Heap-based Priority Queue.
3. **Scheduling algorithms** — implement FCFS, non-preemptive Priority Scheduling, and Round Robin.
4. **Metrics and validation** — calculate scheduling metrics and test edge cases such as idle CPU time and simultaneous arrivals.
5. **Interface and visualization** — build process input, simulation controls, process-state views, and the Gantt chart.
6. **Integration and comparison** — connect the interface to the scheduling engine and add algorithm comparison.
7. **Testing and presentation** — verify results, document complexity, and prepare the project demonstration.

## Project Scope and Limitations

- CorePilot is an educational simulator, not a real operating-system scheduler.
- It will simulate a single CPU in the initial version.
- The initial algorithm set is FCFS, non-preemptive Priority Scheduling, and Round Robin.
- Real process management, multitasking on the host operating system, and multi-core scheduling are outside the initial scope.
- Advanced algorithms or features may be considered only after the core implementation is complete.

---

## Repository

Source code, implementation notes, and project updates will be maintained in this repository:

[https://github.com/ElmanTouhid/DS-project](https://github.com/ElmanTouhid/DS-project)

---

*CorePilot — Making CPU scheduling decisions visible, understandable, and measurable.*
