# CorePilot
### An Interactive CPU Process Scheduling Simulator Using Queues and Priority Queues

CorePilot is a **Data Structures and Algorithms (DSA) course project** that demonstrates how an operating system selects processes for CPU execution. It turns CPU scheduling into an interactive website where users can create processes, run scheduling algorithms, watch data structures operate, and compare performance.

The central goal is to make the DSA concepts visible and explainable. CorePilot will not simply display scheduling results: it will demonstrate how **Queue, Circular Queue, and Priority Queue (implemented with a Min-Heap)** make scheduling decisions.

> **Project type:** DSA course project  
> **Implementation language:** JavaScript  
> **Deployment:** Vercel  
> **Scope:** Educational simulation only; CorePilot does not control the computer's real CPU or schedule actual operating-system processes.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Objectives](#objectives)
- [Scheduling Algorithms](#scheduling-algorithms)
- [How CorePilot Works](#how-corepilot-works)
- [Core Features](#core-features)
- [DSA Implementation](#dsa-implementation)
- [Performance Metrics](#performance-metrics)
- [Technology Stack](#technology-stack)
- [Team Members](#team-members)
- [Development Roadmap](#development-roadmap)
- [Scope and Limitations](#scope-and-limitations)

---

## Project Overview

A computer may have many processes waiting for CPU time, while a CPU core can execute only one process at a time. A scheduling algorithm decides which ready process should execute next.

CorePilot simulates this process in an interactive environment. Users can add processes manually, generate sample workloads, choose a scheduling algorithm, and watch the simulation progress. The website will visualize the ready data structure, the currently running process, and the CPU execution timeline.

CorePilot is built as a **JavaScript-based DSA project**. The team will implement the required data structures and their operations manually instead of relying on built-in Queue or Priority Queue libraries. HTML and CSS will provide the website interface, while JavaScript will handle the data structures, scheduling algorithms, simulation, and interactive behavior.

## Objectives

- Apply Queue, Circular Queue, Priority Queue, and Heap concepts to a practical problem.
- Implement the core data structures manually in JavaScript.
- Demonstrate operations such as enqueue, dequeue, insertion, extraction, and heap adjustment.
- Simulate how processes arrive, wait, execute, and complete.
- Visualize scheduling decisions and changes in the ready data structures.
- Calculate standard CPU scheduling performance metrics.
- Compare scheduling algorithms using the same process workload.
- Keep the implementation clear enough for both team members to explain during the project presentation.

## Scheduling Algorithms

The planned first version includes three algorithms:

| Algorithm | How it works | Data structure |
|---|---|---|
| **First Come, First Served (FCFS)** | Executes ready processes in arrival order. | Queue (FIFO) |
| **Priority Scheduling** | Selects the ready process with the highest priority. | Priority Queue (Min-Heap) |
| **Round Robin (RR)** | Gives each ready process a fixed time quantum; unfinished processes return to the queue. | Circular Queue |

### Scheduling rules

- A process cannot execute before its arrival time.
- Only one process executes on the simulated CPU at a time.
- A smaller priority number represents a higher priority.
- Equal-priority processes are handled using a deterministic tie-breaker, such as arrival order.
- Priority Scheduling will initially be **non-preemptive**: once a process starts, it runs until completion.
- Round Robin uses a configurable time quantum.
- If no process is ready, the CPU remains idle until the next process arrives.

## How CorePilot Works

1. **Create processes:** Add processes manually, generate a random workload, or load a sample scenario.
2. **Configure each process:** Provide a process ID, arrival time, burst time, and priority.
3. **Choose a scheduling algorithm:** Select FCFS, Priority Scheduling, Round Robin, or comparison mode.
4. **Set algorithm options:** Configure the time quantum when using Round Robin.
5. **Start the simulation:** The JavaScript scheduling engine processes arrivals and manages the appropriate ready data structure.
6. **Observe the DSA operations:** Watch processes enter, leave, and move through the Queue, Min-Heap Priority Queue, or Circular Queue.
7. **Follow CPU execution:** View the running process, process states, and Gantt chart.
8. **Review and compare:** Inspect completion time, waiting time, turnaround time, and algorithm comparison results.

## Core Features

### 1. Process Management

- Add and remove processes.
- Assign process ID, arrival time, burst time, and priority.
- Generate random processes.
- Load predefined sample workloads.
- Validate process inputs before simulation.

### 2. Scheduling Configuration

- Select FCFS, Priority Scheduling, or Round Robin.
- Configure the Round Robin time quantum.
- Run one algorithm or compare multiple algorithms using the same workload.

### 3. Interactive DSA Visualization

The data structures themselves are a major part of the project demonstration.

- **Queue:** Show the front and rear, and animate enqueue and dequeue operations.
- **Priority Queue / Min-Heap:** Show the heap structure, insertion, heapify-up, extraction of the minimum-priority value, and heapify-down.
- **Circular Queue:** Show front and rear positions, wrap-around behavior, enqueue, dequeue, and re-queuing of unfinished processes.
- Highlight which process is selected and explain why it is selected.
- Display the data structure's state as the simulation advances.

### 4. Interactive CPU Simulation

- Start, pause, resume, step through, and restart a simulation.
- Adjust simulation speed.
- View the currently running process and its remaining burst time.
- Distinguish ready, running, completed, and not-yet-arrived processes.
- Observe CPU idle periods when no process is ready.

### 5. Gantt Chart

- Display the CPU execution timeline.
- Show process IDs and execution start/end times.
- Represent CPU idle periods.
- Make repeated execution turns visible in Round Robin.

### 6. Performance Analysis

- Calculate completion, turnaround, and waiting times.
- Display average waiting time and average turnaround time.
- Compare algorithm results for the same workload.

## DSA Implementation

**This is the most important part of CorePilot.** The team will write the data structures manually in JavaScript so their internal logic and operations can be demonstrated and explained.

| DSA concept | Planned implementation | Used by |
|---|---|---|
| **Queue** | Custom Queue class using FIFO behavior, with enqueue, dequeue, front/peek, and empty checks. | FCFS |
| **Priority Queue** | Custom Priority Queue implemented using a Min-Heap, with insertion, extract-min, and heapify operations. | Priority Scheduling |
| **Circular Queue** | Custom array-based Circular Queue with front/rear tracking and wrap-around logic. | Round Robin |
| **Array** | Store process information and simulation records where appropriate. | Process management and simulation |
| **Heap** | Maintain the heap property when inserting or removing priority items. | Priority Queue |

### Implementation principles

- Do not use a built-in Queue or Priority Queue library to perform the project's core operations.
- Implement the data structures and their important operations ourselves.
- Keep each data structure in a separate, understandable module or class.
- Explain the logic behind each operation in code comments and project documentation where useful.
- Test the data structures independently before connecting them to the scheduling algorithms.
- Show the data structure state in the website so users can connect the code to its behavior.

### DSA operations to explain in the presentation

| Data structure | Important concepts |
|---|---|
| Queue | FIFO, Front, Rear, Enqueue, Dequeue, Empty Queue |
| Priority Queue (Min-Heap) | Priority, Heap Property, Insert, Extract-Min, Heapify-Up, Heapify-Down |
| Circular Queue | Front, Rear, Enqueue, Dequeue, Modulo / Wrap-Around, Full and Empty Conditions |

## Performance Metrics

CorePilot will calculate the following metrics for each process:

| Metric | Meaning | Formula |
|---|---|---|
| **Completion Time (CT)** | Time at which a process finishes. | Determined by simulation |
| **Turnaround Time (TAT)** | Total time from arrival to completion. | `TAT = CT - AT` |
| **Waiting Time (WT)** | Total time spent waiting for CPU execution. | `WT = TAT - BT` |

Where:
- **AT** = Arrival Time
- **BT** = Burst Time
- **CT** = Completion Time

Average metrics:

- `Average Waiting Time = Sum of Waiting Times / Number of Processes`
- `Average Turnaround Time = Sum of Turnaround Times / Number of Processes`

CPU utilization may also be included if it can be calculated consistently from the simulation timeline.

## Technology Stack

| Layer | Technology | Responsibility |
|---|---|---|
| Website structure | **HTML** | Page structure and interface elements |
| Styling | **CSS** | Layout, visual design, responsiveness, and animations |
| DSA and application logic | **JavaScript** | Custom data structures, scheduling algorithms, simulation, and interactions |
| Visualization | **JavaScript / HTML / CSS** | Queue and heap views, process states, and Gantt chart |
| Deployment | **Vercel** | Publish the website |
| Version control and collaboration | **Git and GitHub** | Source code, teamwork, and project history |

The project will run as a client-side website. **A separate C++ backend, API server, or WebAssembly integration is not part of the current plan.** JavaScript will contain the actual DSA implementations and scheduling logic.

## Team Members

| Name | GitHub | Responsibility |
|---|---|---|
| **Elman Touhid** | [@ElmanTouhid](https://github.com/ElmanTouhid) | To be finalized |
| **Towsif Mahmood** | [@towsif9o9](https://github.com/towsif9o9) | To be finalized |

Both team members will collaborate through the project repository. Individual module ownership will be agreed upon during development.

## Development Roadmap

1. **Planning and interface design** — finalize requirements, scheduling rules, and website layout.
2. **Build the data structures** — implement and test the custom Queue, Min-Heap Priority Queue, and Circular Queue in JavaScript.
3. **Build the scheduling algorithms** — implement FCFS, non-preemptive Priority Scheduling, and Round Robin using the custom structures.
4. **Validate the scheduling engine** — test arrivals, ties, idle CPU time, time quantum behavior, and completion results.
5. **Build the website** — create process input, controls, data structure visualizations, and the Gantt chart.
6. **Integrate and compare** — connect the interface to the JavaScript engine and implement performance comparisons.
7. **Test and deploy** — verify results, prepare the presentation, and publish the website through Vercel.

## Scope and Limitations

- CorePilot is an educational CPU scheduling simulator, not a real operating-system scheduler.
- The initial version simulates a single CPU.
- The initial algorithms are FCFS, non-preemptive Priority Scheduling, and Round Robin.
- The core Queue, Priority Queue, and Circular Queue operations will be implemented manually in JavaScript.
- Real process management, host operating-system control, and multi-core scheduling are outside the initial scope.
- A separate backend API and C++ integration are not required for the current project plan.

---

## Repository

Source code, implementation notes, and project updates will be maintained here:

[https://github.com/ElmanTouhid/DS-project](https://github.com/ElmanTouhid/DS-project)

---

*CorePilot — Making CPU scheduling decisions visible, understandable, and measurable.*
