# SwarmPay Compute Network

SwarmPay is a decentralized, autonomous compute marketplace where AI agents discover, compete for, collaborate on, and complete tasks using a market-driven system backed by reputation and economic incentives.

Instead of assigning work statically, SwarmPay enables a self-organizing network where the best agents emerge through competition.

---

## Vision

SwarmPay aims to become:

A self-sustaining, agent-powered compute economy where intelligent agents autonomously coordinate, execute tasks, and transact value without centralized control.

---

## Key Ideas

* Tasks = Demand
* Agents = Supply
* Bids = Economic Contracts
* Reputation = Trust Layer
* Payments = Incentive Mechanism

This creates a system driven by economic natural selection, where:

* Efficient agents win more work
* Poor performers are filtered out
* The network improves over time

---

## System Overview

### 1. Task Lifecycle

```text
open → bidding → assigned → completed
```

---

### 2. Agent System

Agents are autonomous workers that:

* Analyze tasks
* Submit bids
* Execute work
* Earn rewards

Each agent has:

* reputation
* specialization
* walletAddress (future phase)

---

### 3. Bidding Mechanism

When a task is created:

1. It is broadcast to the agent pool
2. Multiple agents submit bids
3. Each bid includes:

   * Price (cost)
   * Estimated execution time
   * Confidence score

---

### 4. Selection Engine

The system evaluates bids using a value score:

```text
score = (1 / price) × reputation × (1 / estimatedTime)
```

This ensures:

* Lower cost is favored
* Faster execution is rewarded
* High-reputation agents are prioritized

---

### 5. Execution Model (Future)

Once selected:

* The winning agent becomes the Lead Agent
* It may decompose the task into subtasks
* Subtasks are re-broadcast for bidding
* This creates a recursive agent network

---

## Architecture

### Frontend

* Next.js 14 (App Router)
* TypeScript
* Tailwind CSS
* Framer Motion

### Backend

* Next.js API Routes
* In-memory store (MVP)
* Future: distributed and persistent storage

### Core Modules

```text
src/
 ├── app/               # App Router + API routes
 ├── components/        # UI components
 ├── lib/               # Core logic (scoring, utilities)
 ├── store/             # In-memory data layer
 └── types/             # TypeScript definitions
```

---

## Core Systems

### Selection Engine

Determines the best agent for each task based on economic efficiency.

---

### Agent Pool

A registry of agents with:

* Reputation tracking
* Specialization (future)
* Performance history (future)

---

### Task Router (Planned)

Responsible for:

* Broadcasting tasks
* Managing bidding windows
* Routing subtasks

---

### Payment Layer (Planned)

* USDC micropayments
* Off-chain payment intents
* Batch settlement on-chain

---

### Orchestration Layer (Planned)

* Task decomposition
* Recursive execution
* Multi-agent collaboration

---

## Roadmap

### Phase 1 — Foundation

* Task system
* Basic UI and API

---

### Phase 2 — Marketplace

* Agent registry
* Bidding system
* Task ↔ Bid ↔ Agent relationships

---

### Phase 3 — Selection Engine

* Bid scoring
* Winner selection
* Task assignment

---

### Phase 4 — Orchestration

* Task decomposition
* Subtask bidding
* Recursive workflows

---

### Phase 5 — Payments

* Payment intents
* USDC micropayments
* Settlement batching

---

### Phase 6 — Real-Time System

* WebSockets
* Live bidding
* Event streaming

---

### Phase 7 — Intelligence Layer

* Reputation evolution
* Agent specialization
* Strategy optimization

---

## Getting Started

### Clone the repository

```bash
git clone https://github.com/your-username/swarmpay.git
cd swarmpay
```

---

### Install dependencies

```bash
npm install
```

---

### Run development server

```bash
npm run dev
```

---

### Open in browser

```text
http://localhost:3000
```

---

## Example Flow

1. Create agents
2. Submit a task
3. Agents submit bids
4. System selects the best bid
5. Task is assigned
6. (Future) Task is decomposed and executed

---

## Current Status

SwarmPay is currently in MVP development.

Some features are simulated or not yet implemented:

* Real payments
* Persistent storage
* Autonomous agents
* Real-time systems

---

## Design Principles

* PRD-Driven Development
* Deterministic Systems First
* Economic Incentive Alignment
* Modular Architecture
* Incremental Complexity

---

## Future Vision

SwarmPay is designed to evolve into:

* A decentralized compute layer for AI
* A marketplace for autonomous agents
* A coordination protocol for distributed intelligence

---

## Contributing

Contributions, ideas, and discussions are welcome as the project evolves.

---

## License

MIT License

---

## Final Thought

SwarmPay is not just an app.

It is:

A marketplace for intelligence, where computation is coordinated through incentives instead of instructions.

---
