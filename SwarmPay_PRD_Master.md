# SwarmPay Compute Network — Master PRD

> **Version:** 1.0 · **Date:** April 15 2026
> **Author:** Tim (Svector) · **Target:** AI coding agent consumption
> **Status:** Draft for validation

---

## 0 · One-Liner

An autonomous compute marketplace where AI agents compete for tasks, collaborate via sub-contracting, and settle USDC micropayments on Arc — proving a fully self-sustaining AI economy that is only viable with near-zero gas.

---

## 1 · Problem Statement

### 1.1 The Gap

Current AI orchestration frameworks (CrewAI, AutoGen, LangGraph) treat agent collaboration as a coordination problem. None of them treat it as an **economic** problem. Agents have no concept of cost, no incentive to be efficient, and no mechanism to pay each other for services rendered.

### 1.2 Why It Matters

- **Waste:** Without cost signals, agents over-consume compute (redundant API calls, bloated context windows, unnecessary retries).
- **No composability:** There is no protocol for Agent A to purchase a capability from Agent B in real time.
- **Gas kills micropayments:** On Ethereum mainnet, 60 micropayments at ~$0.50 gas each = $30 overhead on a $0.28 task. The economics are impossible.

### 1.3 The Thesis

If you give agents wallets, let them bid competitively, and settle on a chain with near-zero gas (Arc), you unlock a new primitive: **autonomous agent commerce**. SwarmPay is the proof.

---

## 2 · Idea Validation

### 2.1 Market Signals

| Signal | Evidence |
|--------|----------|
| Agent-to-agent payments | Coinbase x402 protocol (HTTP 402 Payment Required for machine-to-machine payments) |
| Pay-per-use compute | AWS Lambda, Modal, Replicate already bill per-ms/per-second |
| Agent orchestration | CrewAI ($18M raise), AutoGen (Microsoft), LangGraph (LangChain) |
| Stablecoin micropayments | Circle USDC Programmable Wallets, USDC on L2s |
| AI agent economy | a16z "AI agents will have wallets" thesis, Near AI agent framework |

### 2.2 Competitive Landscape

| Competitor | What They Do | What They Miss |
|------------|-------------|----------------|
| CrewAI | Multi-agent orchestration | No payments, no economic incentives |
| AutoGen | Agent conversation framework | No cost model, no settlement |
| Morpheus | Decentralized AI compute | No agent-to-agent micro-economy |
| Ritual | On-chain AI inference | Focused on model hosting, not agent commerce |
| SwarmPay (us) | Agents compete, transact, settle on Arc | Full economic loop |

### 2.3 Unit Economics Regression

**Scenario:** User submits "Summarize top crypto opportunities this week" with $0.30 budget.

| Cost Component | Per-Unit Cost | Units | Total |
|----------------|--------------|-------|-------|
| LLM inference (orchestrator) | $0.002 / call | 5 | $0.010 |
| Web data fetch (research agent) | $0.001 / fetch | 8 | $0.008 |
| Compute sandbox (per ms) | $0.000001 / ms | 8,000 | $0.008 |
| Data cleaning (sub-agent) | $0.001 / step | 3 | $0.003 |
| Analysis passes | $0.002 / pass | 4 | $0.008 |
| **Subtotal (work)** | | | **$0.037** |
| Agent profit margins (avg 40%) | | | $0.015 |
| Platform fee (10% of budget) | | | $0.030 |
| **Total cost to user** | | | **$0.082** |
| **User savings vs budget** | | | **$0.218** |

**Key insight:** The competitive bidding model drives costs DOWN. Agents that are wasteful lose bids. Natural selection for efficiency.

### 2.4 Gas Comparison (Why Arc Is Required)

| Chain | Avg Gas/Tx | 60 Micropayments | Viable? |
|-------|-----------|-------------------|---------|
| Ethereum L1 | ~$0.50 | $30.00 | No |
| Polygon | ~$0.01 | $0.60 | Marginal |
| Arbitrum | ~$0.005 | $0.30 | Barely (eats entire budget) |
| Arc | ~$0.00001 | $0.0006 | Yes — economically invisible |

This table is the single most important slide in any demo. It proves the idea is chain-dependent.

---

## 3 · System Architecture

### 3.1 High-Level Components

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT LAYER                      │
│  Next.js Frontend · Task Input · Live Dashboard      │
└──────────────────────┬──────────────────────────────┘
                       │ WebSocket + REST
┌──────────────────────▼──────────────────────────────┐
│                 ORCHESTRATION LAYER                   │
│  Task Router · Bid Manager · Agent Registry           │
│  Payment Escrow · Settlement Batcher                  │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌──────────────┐┌──────────────┐┌──────────────┐
│  AGENT POOL  ││  AGENT POOL  ││  AGENT POOL  │
│  Research    ││  Analyzer    ││  Compute     │
│  Agents      ││  Agents      ││  Agents      │
└──────┬───────┘└──────┬───────┘└──────┬───────┘
       │               │               │
       └───────────────┼───────────────┘
                       │ USDC Micropayments
┌──────────────────────▼──────────────────────────────┐
│                  PAYMENT LAYER                        │
│  Circle Programmable Wallets · Off-chain Ledger       │
│  402 Payment Required Protocol · Batch Settler        │
└──────────────────────┬──────────────────────────────┘
                       │ Batch Settlement
┌──────────────────────▼──────────────────────────────┐
│                   ARC CHAIN                           │
│  USDC Contract · Settlement Contract · Event Log      │
└─────────────────────────────────────────────────────┘
```

### 3.2 Component Breakdown

#### 3.2.1 Client Layer
- **Framework:** Next.js 14 (App Router)
- **Real-time:** WebSocket connection for live payment stream, agent status, compute meter
- **Key views:** Task input → Agent bidding → Live execution → Result + cost breakdown

#### 3.2.2 Orchestration Layer
- **Task Router:** Receives user task, broadcasts to agent pool, collects bids, selects winner
- **Bid Manager:** Ranks bids by price, reputation score, and estimated completion time
- **Agent Registry:** Tracks all registered agents, their capabilities, wallet addresses, and reputation
- **Payment Escrow:** Holds user's approved budget; releases funds as work completes
- **Settlement Batcher:** Accumulates off-chain payment intents; settles on Arc every N seconds or at task completion

#### 3.2.3 Agent Pool
Each agent is a stateless worker with:
- A unique ID and capability descriptor
- A Circle Programmable Wallet (USDC)
- A bid strategy (can be simple or ML-driven)
- An execution runtime (sandboxed)

**Agent types for demo:**
| Agent Type | Capability | Example Work |
|------------|-----------|--------------|
| Research Agent | Web data fetching, API calls | Fetch CoinGecko data, scrape news |
| Analyzer Agent | Data processing, LLM reasoning | Clean data, run analysis, generate insights |
| Compute Agent | Sandboxed code execution | Run Python scripts, compute metrics |

#### 3.2.4 Payment Layer
- **Off-chain ledger:** In-memory ledger tracking every micropayment intent (sender, receiver, amount, timestamp, task_id)
- **402 Protocol:** When Agent A requests work from Agent B, Agent B responds with HTTP 402 + price. Agent A signs a payment intent. Agent B performs work.
- **Batch settlement:** All payment intents for a task are batched into 1–2 on-chain transactions on Arc at task completion

#### 3.2.5 Arc Chain
- **Settlement contract:** Accepts a batch of (from, to, amount) tuples, executes all transfers atomically
- **Event log:** Emits events for each micropayment settled — provides full audit trail
- **USDC:** Circle USDC on Arc (or bridged equivalent for demo)

---

## 4 · Data Models

### 4.1 Core Entities

```typescript
// ─── Task ───────────────────────────────────────────
interface Task {
  id: string;                    // UUID
  userId: string;
  prompt: string;                // "Summarize top crypto opportunities"
  budget: number;                // 0.30 (USDC)
  status: TaskStatus;           // pending | bidding | executing | completed | failed
  winningBid: string | null;    // Bid ID
  subTasks: SubTask[];
  result: string | null;
  costBreakdown: CostBreakdown;
  createdAt: number;
  completedAt: number | null;
}

type TaskStatus = 'pending' | 'bidding' | 'executing' | 'completed' | 'failed';

// ─── Bid ────────────────────────────────────────────
interface Bid {
  id: string;
  taskId: string;
  agentId: string;
  price: number;                // Agent's quoted price in USDC
  estimatedTimeMs: number;
  confidence: number;           // 0-1
  strategy: string;             // Brief description of approach
  submittedAt: number;
}

// ─── SubTask ────────────────────────────────────────
interface SubTask {
  id: string;
  taskId: string;
  parentAgentId: string;        // Lead agent that created this
  type: SubTaskType;
  description: string;
  status: SubTaskStatus;
  assignedAgentId: string | null;
  bids: SubBid[];               // Sub-agents also bid
  cost: number;
  startedAt: number | null;
  completedAt: number | null;
  result: any;
}

type SubTaskType = 'fetch_data' | 'clean_data' | 'analyze' | 'compute' | 'summarize';
type SubTaskStatus = 'open' | 'bidding' | 'assigned' | 'running' | 'completed' | 'failed';

// ─── SubBid ─────────────────────────────────────────
interface SubBid {
  id: string;
  subTaskId: string;
  agentId: string;
  price: number;
  submittedAt: number;
}

// ─── Agent ──────────────────────────────────────────
interface Agent {
  id: string;
  name: string;                 // "Research-Alpha-01"
  type: AgentType;
  capabilities: string[];
  walletAddress: string;        // Circle wallet
  balance: number;              // Current USDC balance
  reputation: number;           // 0-100, updated after each task
  totalEarned: number;
  tasksCompleted: number;
  avgResponseTimeMs: number;
}

type AgentType = 'research' | 'analyzer' | 'compute' | 'orchestrator';

// ─── Payment Intent (off-chain) ─────────────────────
interface PaymentIntent {
  id: string;
  taskId: string;
  subTaskId: string | null;
  from: string;                 // Agent/user wallet
  to: string;                   // Agent wallet
  amount: number;               // USDC
  reason: string;               // "fetch_data_step_1"
  status: 'pending' | 'signed' | 'settled';
  createdAt: number;
  settledTxHash: string | null;
}

// ─── Settlement Batch ───────────────────────────────
interface SettlementBatch {
  id: string;
  taskId: string;
  payments: PaymentIntent[];
  totalAmount: number;
  txHash: string | null;
  status: 'pending' | 'submitted' | 'confirmed' | 'failed';
  createdAt: number;
  confirmedAt: number | null;
}

// ─── Compute Session ────────────────────────────────
interface ComputeSession {
  id: string;
  taskId: string;
  subTaskId: string;
  agentId: string;
  code: string;                 // Code to execute
  startedAt: number;
  endedAt: number | null;
  durationMs: number;
  costPerMs: number;            // 0.000001
  totalCost: number;
  output: string | null;
  cpuUsagePercent: number[];    // Time series for live meter
}

// ─── Cost Breakdown ─────────────────────────────────
interface CostBreakdown {
  research: number;
  compute: number;
  analysis: number;
  platformFee: number;
  totalPayments: number;        // Count of micropayments
  totalCost: number;
  userBudget: number;
  userSavings: number;
}

// ─── Leaderboard Entry ──────────────────────────────
interface LeaderboardEntry {
  agentId: string;
  agentName: string;
  totalEarned: number;
  tasksWon: number;
  avgBidPrice: number;
  winRate: number;              // percentage
  reputation: number;
}
```

---

## 5 · Demo Flow (Exact Sequence)

This is the beat-by-beat experience. Every second matters for judges.

### Phase 1 — User Input (0–10s)

**Screen:** Clean input with prominent text field and USDC balance indicator.

1. User sees their Circle Wallet balance: `$5.00 USDC`
2. User types: `"Summarize top crypto opportunities this week"`
3. User clicks **Submit**
4. Modal: "Approve spending up to **$0.30 USDC** for this task?" → User clicks **Approve**
5. Budget is escrowed (moved to platform escrow in off-chain ledger)
6. Status changes to: `Finding agents...`

**Key visual:** USDC balance decrements from $5.00 to $4.70 (budget held in escrow).

### Phase 2 — Agent Bidding War (10–20s)

**Screen:** Three agent cards appear with animated entrance. Bids stream in real-time.

1. Task is broadcast to all registered agents
2. Three agents respond with bids (staggered by 1–2s for drama):
   - **Research-Alpha** bids $0.25 → card shows price, reputation (92), estimated time (45s)
   - **DataMiner-Pro** bids $0.18 → card shows price, reputation (87), estimated time (60s)
   - **CryptoScout-X** bids $0.22 → card shows price, reputation (95), estimated time (40s)
3. System evaluates: `score = (1/price) × reputation × (1/estimatedTime)`
4. **Winner highlight:** CryptoScout-X wins (best value score) — card glows, others fade
5. CryptoScout-X becomes the **Lead Agent**

**Key visual:** Bid cards animate in, prices flash, winner selection has a brief highlight animation. This shows agents acting like freelancers competing for money.

### Phase 3 — Task Decomposition + Sub-Agent Bidding (20–35s)

**Screen:** Splits into task breakdown panel. Sub-tasks appear as cards.

1. Lead Agent (CryptoScout-X) decomposes task into 4 sub-tasks:
   - `fetch_data` — "Retrieve top 20 crypto prices and 7-day trends"
   - `clean_data` — "Normalize and structure raw price data"
   - `analyze` — "Identify top 5 opportunities with reasoning"
   - `compute` — "Run correlation analysis and risk scoring"

2. Lead Agent broadcasts each sub-task to specialist agents
3. **Sub-agent bidding** (the recursive marketplace):
   - For `fetch_data`: 3 research agents bid → cheapest wins
   - For `clean_data`: 2 agents bid → cheapest wins
   - For `analyze`: 2 analyzer agents bid → best value wins
   - For `compute`: Compute agent provides rate ($0.000001/ms)

4. Each winning sub-agent is assigned and confirmed

**Key visual:** Tree diagram showing Lead Agent at top, sub-tasks branching down, sub-agent bids appearing on each branch, winners highlighted.

### Phase 4 — Execution + Live Micropayments (35–65s)

**Screen:** Full dashboard — agent activity feed (left), payment stream (center), compute meter (right).

This is the core of the demo. Everything runs concurrently.

#### Payment Stream (center panel)
Every agent interaction triggers a 402 → payment → response cycle:

```
[35s] Research-R2 → fetches CoinGecko API        → $0.0003
[36s] Research-R2 → fetches CoinMarketCap API     → $0.0003
[37s] Research-R2 → fetches DeFiLlama API         → $0.0003
[38s] CryptoScout-X → pays Research-R2            → $0.001
[39s] Cleaner-C1 → normalizes batch 1             → $0.0005
[40s] Cleaner-C1 → normalizes batch 2             → $0.0005
[41s] CryptoScout-X → pays Cleaner-C1             → $0.001
[42s] Analyzer-A3 → starts analysis pass 1        → $0.002
[43s] Analyzer-A3 → requests compute sandbox      → 402 PAYMENT REQUIRED
[44s] Analyzer-A3 → signs payment intent           → $0.0005
[45s] Compute sandbox → starts execution           → timer begins
...
[60s] Analyzer-A3 → analysis complete              → $0.002
[61s] CryptoScout-X → pays Analyzer-A3            → $0.005
[62s] CryptoScout-X → generates final summary     → $0.002
[63s] CryptoScout-X → delivers result to user     → done
```

**Transaction counter** in corner: increments with each payment → hits 60+

#### Compute Meter (right panel)
When compute sandbox is active (45s–58s):
- **CPU gauge:** Animated semicircle, fluctuating 40–85%
- **Timer:** `00:00.000` counting up in milliseconds
- **Cost ticker:** `$0.000000` incrementing at $0.000001/ms
- **Final:** 8,000ms = $0.008

#### Agent Activity Feed (left panel)
Scrolling log of agent actions:
```
[42s] Analyzer-A3: "Starting correlation analysis on 20 tokens..."
[43s] Analyzer-A3: "Requesting compute sandbox — sending 402..."
[44s] Compute-Node: "Payment received. Spinning up sandbox..."
[45s] Compute-Node: "Executing risk_scoring.py..."
[55s] Compute-Node: "Execution complete. 8,247ms. Cost: $0.008247"
```

### Phase 5 — Result + Cost Breakdown (65–80s)

**Screen:** Result panel with expandable cost breakdown.

1. Final output appears (the actual report/summary)
2. Cost breakdown card:

```
┌─────────────────────────────────────┐
│  TASK COMPLETE                       │
│                                      │
│  Total Cost:        $0.082           │
│  Your Budget:       $0.300           │
│  You Saved:         $0.218 (73%)     │
│                                      │
│  ── Breakdown ──                     │
│  Research:          $0.008           │
│  Data Cleaning:     $0.003           │
│  Analysis:          $0.012           │
│  Compute (8.2s):    $0.008           │
│  Agent Margins:     $0.021           │
│  Platform Fee:      $0.030           │
│                                      │
│  Micropayments:     63               │
│  Agents Used:       5                │
│  Time Elapsed:      48s              │
└─────────────────────────────────────┘
```

3. **Refund animation:** Unused budget ($0.218) returns to user wallet. Balance goes $4.70 → $4.918.

### Phase 6 — Agent Leaderboard + Profit Split (80–85s)

**Screen:** Leaderboard table updates in real-time.

| Rank | Agent | Earned | Tasks Won | Win Rate | Reputation |
|------|-------|--------|-----------|----------|------------|
| 1 | CryptoScout-X | $0.041 | 12 | 78% | 95 |
| 2 | Analyzer-A3 | $0.023 | 8 | 65% | 91 |
| 3 | Research-R2 | $0.012 | 15 | 82% | 87 |
| 4 | Cleaner-C1 | $0.006 | 6 | 60% | 83 |

Key point: Efficient agents earn more. This is economic natural selection.

### Phase 7 — On-Chain Settlement (85–95s)

**Screen:** Settlement panel with transaction details.

1. All 63 off-chain payment intents are batched
2. **1 settlement transaction** is submitted to Arc
3. Show Arc Explorer link with confirmed transaction
4. Show Circle Developer Console with updated USDC balances

**Key visual:** Animation of 63 payment intents compressing into 1 on-chain transaction. Arc Explorer screenshot/embed showing confirmed tx.

### Phase 8 — The Margin Proof (95–100s)

**Screen:** Comparison card — the knockout punch.

```
┌─────────────────────────────────────────────┐
│  WHY THIS ONLY WORKS ON ARC                  │
│                                              │
│  63 micropayments                            │
│                                              │
│  On Ethereum:  63 × $0.50  = $31.50  ❌      │
│  On Polygon:   63 × $0.01  = $0.63   ⚠️      │
│  On Arc:       63 × $0.00001 = $0.0006 ✅    │
│                                              │
│  Task value: $0.28                           │
│  Ethereum gas alone exceeds task value 112x  │
│                                              │
│  Nanopayments are only viable on Arc.        │
└─────────────────────────────────────────────┘
```

---

## 6 · API Specifications

### 6.1 REST Endpoints

```
POST   /api/tasks                    Create new task
GET    /api/tasks/:id                Get task status + result
POST   /api/tasks/:id/approve        Approve budget & start bidding
GET    /api/tasks/:id/payments       Get payment stream for task
GET    /api/tasks/:id/breakdown      Get final cost breakdown

GET    /api/agents                   List all agents
GET    /api/agents/:id               Get agent details + stats
GET    /api/agents/:id/earnings      Get agent earnings history

POST   /api/bids                     Submit bid (agent-facing)
GET    /api/bids?taskId=X            Get bids for task

POST   /api/subtasks/:id/bid         Submit sub-bid
POST   /api/subtasks/:id/complete    Mark sub-task complete

POST   /api/compute/start            Start compute session
POST   /api/compute/:id/stop         Stop compute session
GET    /api/compute/:id/metrics      Get live compute metrics

POST   /api/payments/intent          Create payment intent (402 flow)
POST   /api/payments/sign            Sign payment intent
POST   /api/payments/settle          Trigger batch settlement

GET    /api/leaderboard              Get agent leaderboard
GET    /api/settlement/:taskId       Get settlement tx details
```

### 6.2 WebSocket Events

```
Client subscribes to: ws://localhost:3001/ws?taskId=X

Server emits:
  task:status          { taskId, status }
  bid:received         { bid }
  bid:winner           { bid, agentId }
  subtask:created      { subTask }
  subtask:bid          { subTaskId, bid }
  subtask:assigned     { subTaskId, agentId }
  subtask:started      { subTaskId, agentId }
  subtask:completed    { subTaskId, result, cost }
  payment:intent       { paymentIntent }
  payment:signed       { paymentId }
  payment:settled      { paymentId, txHash }
  compute:started      { sessionId }
  compute:tick         { sessionId, durationMs, cost, cpuPercent }
  compute:completed    { sessionId, totalMs, totalCost }
  agent:activity       { agentId, message, timestamp }
  settlement:batch     { batchId, paymentCount }
  settlement:confirmed { batchId, txHash }
  task:completed       { taskId, result, costBreakdown }
```

### 6.3 402 Payment Required Flow

```
Agent A → Agent B:
  POST /agent/b/execute { task: "fetch_data", params: {...} }

Agent B responds:
  402 Payment Required
  X-Payment-Amount: 0.001
  X-Payment-Currency: USDC
  X-Payment-Address: 0x...agentB
  X-Payment-Network: arc

Agent A signs payment intent:
  POST /api/payments/intent
  { from: agentA, to: agentB, amount: 0.001, taskId: X }

Agent A retries with payment proof:
  POST /agent/b/execute
  Headers: X-Payment-Id: <intent_id>
  Body: { task: "fetch_data", params: {...} }

Agent B verifies payment intent, executes, returns result.
```

---

## 7 · Technical Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 14 (App Router) + TypeScript | SSR, WebSocket support, fast iteration |
| Styling | Tailwind CSS + Framer Motion | Clean UI with smooth animations for payment stream |
| Real-time | Socket.io or native WebSocket | Live payment feed, compute meter, agent activity |
| Backend | Node.js + Express (or Next.js API routes) | Simple, fast, JS ecosystem alignment |
| Agent runtime | Node.js workers or isolated processes | Each agent runs independently |
| Compute sandbox | Docker container or vm2 | Isolated code execution with time tracking |
| Payment ledger | In-memory (Redis optional) | Off-chain micropayment tracking |
| Wallet | Circle Programmable Wallets SDK | USDC wallets for each agent + user |
| Settlement | Arc chain + ethers.js/viem | Batch settlement contract |
| Smart contract | Solidity (simple batch transfer) | Single contract for atomic multi-transfer |
| Database | SQLite or Postgres (lightweight) | Task history, agent registry, leaderboard |

---

## 8 · Smart Contract Spec

### 8.1 BatchSettlement.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BatchSettlement {
    IERC20 public usdc;
    address public platform;

    event BatchSettled(
        bytes32 indexed taskId,
        uint256 paymentCount,
        uint256 totalAmount
    );

    event PaymentSettled(
        bytes32 indexed taskId,
        address indexed from,
        address indexed to,
        uint256 amount
    );

    struct Payment {
        address from;
        address to;
        uint256 amount;
    }

    constructor(address _usdc) {
        usdc = IERC20(_usdc);
        platform = msg.sender;
    }

    function settleBatch(
        bytes32 taskId,
        Payment[] calldata payments
    ) external {
        uint256 total = 0;
        for (uint256 i = 0; i < payments.length; i++) {
            require(
                usdc.transferFrom(
                    payments[i].from,
                    payments[i].to,
                    payments[i].amount
                ),
                "Transfer failed"
            );
            total += payments[i].amount;
            emit PaymentSettled(
                taskId,
                payments[i].from,
                payments[i].to,
                payments[i].amount
            );
        }
        emit BatchSettled(taskId, payments.length, total);
    }
}
```

### 8.2 Deployment Notes
- Deploy on Arc staging/testnet first
- USDC address: use Arc's native USDC or deploy a mock ERC-20 for demo
- All agent wallets must approve the BatchSettlement contract to spend their USDC (via `approve()`)
- Platform wallet acts as the escrow holder during task execution

---

## 9 · State Machine

### 9.1 Task Lifecycle

```
                    ┌──────────┐
                    │ CREATED  │
                    └────┬─────┘
                         │ user approves budget
                    ┌────▼─────┐
             ┌──────│ BIDDING  │──────┐
             │      └────┬─────┘      │
             │           │ bids received, winner selected
             │      ┌────▼─────┐      │
             │      │DECOMPOSING│     │ timeout → no bids
             │      └────┬─────┘      │
             │           │ sub-tasks created    │
             │      ┌────▼─────┐      │
             │      │SUB_BIDDING│     │
             │      └────┬─────┘      │
             │           │ sub-agents assigned  │
             │      ┌────▼─────┐      │
             │      │EXECUTING │      │
             │      └────┬─────┘      │
             │           │ all sub-tasks complete
             │      ┌────▼─────┐      │
             │      │ SETTLING │      │
             │      └────┬─────┘      │
             │           │ on-chain tx confirmed
             │      ┌────▼─────┐      │
             │      │COMPLETED │      │
             │      └──────────┘      │
             │                        │
             │      ┌──────────┐      │
             └──────│  FAILED  │◄─────┘
                    └──────────┘
```

### 9.2 Payment Intent Lifecycle

```
CREATED → SIGNED → BATCHED → SETTLED
                            ↘ FAILED (retry or refund)
```

### 9.3 Sub-Task Lifecycle

```
OPEN → BIDDING → ASSIGNED → RUNNING → COMPLETED
                                     ↘ FAILED (reassign or abort)
```

---

## 10 · Edge Cases & Failure Handling

| Scenario | Handling |
|----------|---------|
| No agents bid on task | Timeout after 15s → refund user → status FAILED |
| Sub-agent fails mid-task | Lead agent reassigns to next-best bidder. If no alternatives, partial refund |
| Compute sandbox crashes | Kill session, record partial duration, charge for completed ms only |
| Agent bids but doesn't deliver | Reputation penalty (-10), blacklist after 3 failures |
| User budget exhausted mid-task | Pause execution, notify user, offer to top up or accept partial result |
| Settlement tx fails on Arc | Retry with higher gas (still negligible). After 3 retries, alert platform |
| Agent tries to overbid (collude) | Bid cap at 90% of user budget. Outlier detection on bid patterns |
| WebSocket disconnects | Client reconnects, server replays missed events from task event log |
| Two sub-agents tie on bid | Tiebreak by reputation, then by response time |
| Malicious agent submits garbage result | Lead agent validates output (basic quality check). Reject + reputation penalty |

---

## 11 · Judging Criteria Analysis

### 11.1 Innovation / Novelty

**Score target: 9/10**

| What makes it novel | Evidence |
|--------------------|----|
| First agent-to-agent payment marketplace | No existing framework combines bidding + micropayments + compute billing |
| Recursive bidding (sub-agents bid too) | Goes beyond simple orchestration — it's a market all the way down |
| Economic natural selection for AI agents | Agents compete on price AND quality — inefficient agents die out |
| 402 Payment Required as a machine protocol | Repurposes HTTP status code as a payment handshake between agents |
| Per-millisecond compute billing with live visualization | Makes invisible compute costs tangible and visual |

### 11.2 Technical Complexity

**Score target: 9/10**

| Component | Complexity |
|-----------|-----------|
| Multi-agent orchestration with dynamic sub-contracting | High |
| Real-time WebSocket payment stream (60+ events) | Medium-High |
| Off-chain payment ledger with on-chain batch settlement | High |
| Sandboxed compute with per-ms billing | Medium |
| Circle Programmable Wallets integration | Medium |
| Smart contract for atomic batch transfers | Medium |
| Live compute meter with CPU visualization | Medium |

### 11.3 Use of Sponsor Technology

**Score target: 10/10**

| Sponsor Tech | How It's Used | Depth |
|-------------|--------------|-------|
| Arc Chain | All micropayment settlement. The entire thesis depends on Arc's near-zero gas. Margin proof slide directly compares Arc vs alternatives | Deep — it's the foundational layer |
| Circle USDC | Every agent has a Circle Programmable Wallet. All payments are USDC. Budget approval, escrow, refunds, and settlement all use Circle | Deep — payments are the core loop |
| (If applicable) Any AI sponsor | Agent inference, task decomposition, analysis generation | Integration-level |

### 11.4 Demo Quality / Presentation

**Score target: 9/10**

| Element | Implementation |
|---------|---------------|
| Visual impact | Live payment stream, animated bid war, pulsing compute meter |
| Storytelling | Clear 8-step narrative with escalating complexity |
| Proof of concept | Real USDC moves, real on-chain settlement, real compute billing |
| "Wow" moment | 63 micropayments settling in 1 tx — the gas comparison slide |
| Audience engagement | User types a real prompt, watches agents compete in real time |

### 11.5 Business Viability / Market Fit

**Score target: 8/10**

| Factor | Assessment |
|--------|-----------|
| Revenue model | Platform takes 10% fee on all tasks. Compute markup on sandbox usage |
| Market timing | AI agent frameworks exploding (CrewAI, AutoGen). No one does payments yet |
| Defensibility | Network effects — more agents = better prices = more users |
| Scalability | Off-chain ledger handles throughput. Settlement batching reduces on-chain load |
| Real demand | Every AI agent framework will eventually need economic primitives |

### 11.6 Completeness

**Score target: 8/10**

| Requirement | Status |
|------------|--------|
| Working end-to-end demo | Full loop: input → bidding → execution → payment → settlement |
| On-chain proof | Arc Explorer shows confirmed settlement tx |
| Multiple agents interacting | 5+ agents across 3 types |
| Real money movement | USDC balances change in Circle console |
| Error handling | Timeouts, retries, partial refunds demonstrated |
| Documentation | This PRD + README + inline code comments |

### 11.7 Code Quality

**Score target: 8/10**

| Practice | Implementation |
|----------|---------------|
| TypeScript throughout | Strict types, interfaces for all entities |
| Modular architecture | Separate packages: core, agents, payments, settlement, frontend |
| Testing | Unit tests for payment logic, integration test for full task flow |
| Clean separation of concerns | Orchestration ≠ Payment ≠ Settlement ≠ UI |
| Environment configs | `.env` for API keys, RPC URLs, contract addresses |

---

## 12 · Regression Test Plan

### 12.1 Unit Tests

```
Payment Logic:
  ✓ Payment intent creation with valid params
  ✓ Payment intent rejection with insufficient balance
  ✓ Batch aggregation correctly sums amounts
  ✓ Batch settlement produces correct contract call data
  ✓ Refund calculation when budget not fully used

Bidding Logic:
  ✓ Bid scoring formula produces correct rankings
  ✓ Tiebreak logic (reputation → response time)
  ✓ Bid timeout triggers FAILED state
  ✓ Sub-bid collection and winner selection
  ✓ Bid cap enforcement (90% of budget)

Agent Logic:
  ✓ Agent registration with valid wallet
  ✓ Reputation update after successful task
  ✓ Reputation penalty after failure
  ✓ Agent blacklist after 3 consecutive failures

Compute Billing:
  ✓ Timer accuracy within 10ms tolerance
  ✓ Cost calculation at $0.000001/ms
  ✓ Session termination on timeout
  ✓ Partial billing on crash

Task State Machine:
  ✓ Valid state transitions (CREATED → BIDDING → ... → COMPLETED)
  ✓ Invalid state transitions rejected
  ✓ Timeout transitions (BIDDING → FAILED after 15s)
  ✓ Concurrent sub-task completion triggers parent completion
```

### 12.2 Integration Tests

```
End-to-End Flow:
  ✓ User submits task → receives result with cost breakdown
  ✓ 60+ payment intents created during execution
  ✓ All payment intents batch-settled in 1–2 on-chain txs
  ✓ Agent balances updated correctly after settlement
  ✓ User receives refund for unused budget

402 Flow:
  ✓ Agent A requests work → receives 402
  ✓ Agent A signs payment → retries → receives result
  ✓ Payment intent recorded in ledger

WebSocket:
  ✓ Client receives all events in correct order
  ✓ Reconnection replays missed events
  ✓ Multiple clients receive same events for same task

Settlement:
  ✓ Batch settlement tx confirms on Arc testnet
  ✓ Event logs match off-chain ledger
  ✓ Gas cost < $0.001 for 60+ payment batch
```

### 12.3 Stress / Regression Tests

```
Load:
  ✓ 5 concurrent tasks execute without interference
  ✓ 200+ payment intents in single batch settle correctly
  ✓ WebSocket handles 100+ events/second without dropping

Edge:
  ✓ Task with $0.01 budget (minimum viable)
  ✓ Task with $10.00 budget (large)
  ✓ Agent with $0.00 balance cannot bid
  ✓ All agents fail → user fully refunded
  ✓ Network interruption during settlement → retry succeeds
```

---

## 13 · File / Folder Structure

```
swarmpay/
├── apps/
│   └── web/                          # Next.js 14 frontend
│       ├── app/
│       │   ├── page.tsx              # Main dashboard
│       │   ├── layout.tsx
│       │   └── api/
│       │       ├── tasks/            # Task CRUD
│       │       ├── agents/           # Agent registry
│       │       ├── bids/             # Bidding endpoints
│       │       ├── payments/         # Payment intent + settlement
│       │       ├── compute/          # Compute session management
│       │       └── leaderboard/      # Agent rankings
│       ├── components/
│       │   ├── TaskInput.tsx         # User input form
│       │   ├── BidWar.tsx            # Agent bidding visualization
│       │   ├── TaskTree.tsx          # Sub-task decomposition tree
│       │   ├── PaymentStream.tsx     # Live payment feed
│       │   ├── ComputeMeter.tsx      # CPU gauge + cost ticker
│       │   ├── AgentActivity.tsx     # Agent log feed
│       │   ├── CostBreakdown.tsx     # Final cost card
│       │   ├── Leaderboard.tsx       # Agent rankings table
│       │   ├── SettlementProof.tsx   # On-chain tx display
│       │   ├── MarginProof.tsx       # Gas comparison card
│       │   └── WalletBalance.tsx     # USDC balance display
│       ├── hooks/
│       │   ├── useWebSocket.ts       # WebSocket connection
│       │   ├── useTask.ts            # Task state management
│       │   └── usePayments.ts        # Payment stream subscription
│       └── lib/
│           ├── types.ts              # All TypeScript interfaces
│           ├── constants.ts          # Pricing, timeouts, config
│           └── utils.ts              # Formatting, calculations
│
├── packages/
│   ├── core/                         # Shared types + utilities
│   │   ├── types.ts
│   │   ├── constants.ts
│   │   └── validation.ts
│   │
│   ├── agents/                       # Agent runtime
│   │   ├── base-agent.ts             # Abstract agent class
│   │   ├── research-agent.ts         # Web fetching agent
│   │   ├── analyzer-agent.ts         # Analysis agent
│   │   ├── compute-agent.ts          # Sandboxed compute agent
│   │   ├── agent-registry.ts         # Agent registration + discovery
│   │   └── bid-strategy.ts           # Bid calculation logic
│   │
│   ├── orchestrator/                 # Task orchestration
│   │   ├── task-router.ts            # Task lifecycle management
│   │   ├── bid-manager.ts            # Bid collection + scoring
│   │   ├── decomposer.ts            # Task → sub-task breakdown
│   │   └── sub-bid-manager.ts        # Sub-agent bidding
│   │
│   ├── payments/                     # Payment system
│   │   ├── escrow.ts                 # Budget escrow management
│   │   ├── payment-intent.ts         # Off-chain payment intents
│   │   ├── payment-ledger.ts         # In-memory ledger
│   │   ├── four-oh-two.ts            # 402 Payment Required handler
│   │   └── batch-settler.ts          # Batch settlement logic
│   │
│   ├── compute/                      # Compute sandbox
│   │   ├── sandbox.ts                # Isolated execution environment
│   │   ├── timer.ts                  # Millisecond-accurate billing timer
│   │   └── metrics.ts                # CPU usage + cost tracking
│   │
│   └── settlement/                   # On-chain settlement
│       ├── arc-client.ts             # Arc chain interaction
│       ├── contract.ts               # BatchSettlement contract ABI + calls
│       └── circle-wallets.ts         # Circle SDK integration
│
├── contracts/                        # Solidity
│   ├── BatchSettlement.sol
│   ├── MockUSDC.sol                  # For testing
│   └── hardhat.config.ts
│
├── test/
│   ├── unit/
│   │   ├── payment-intent.test.ts
│   │   ├── bid-scoring.test.ts
│   │   ├── compute-billing.test.ts
│   │   └── state-machine.test.ts
│   ├── integration/
│   │   ├── full-task-flow.test.ts
│   │   ├── settlement.test.ts
│   │   └── websocket.test.ts
│   └── stress/
│       ├── concurrent-tasks.test.ts
│       └── large-batch.test.ts
│
├── .env.example
├── package.json
├── tsconfig.json
├── README.md
└── docs/
    ├── ARCHITECTURE.md
    ├── API.md
    └── DEMO_SCRIPT.md
```

---

## 14 · Environment Variables

```env
# Arc Chain
ARC_RPC_URL=https://rpc.arc.xyz
ARC_CHAIN_ID=
ARC_EXPLORER_URL=https://explorer.arc.xyz

# Settlement Contract
SETTLEMENT_CONTRACT_ADDRESS=
MOCK_USDC_ADDRESS=

# Circle
CIRCLE_API_KEY=
CIRCLE_WALLET_SET_ID=
CIRCLE_ENV=sandbox

# Platform
PLATFORM_WALLET_ADDRESS=
PLATFORM_FEE_PERCENT=10
ESCROW_TIMEOUT_MS=300000

# Agent Config
BID_TIMEOUT_MS=15000
MAX_AGENTS_PER_TASK=10
COMPUTE_COST_PER_MS=0.000001
MAX_COMPUTE_DURATION_MS=60000

# WebSocket
WS_PORT=3001

# LLM (for agent reasoning — optional, can be simulated)
OPENAI_API_KEY=
LLM_MODEL=gpt-4o-mini
```

---

## 15 · Implementation Priority (Build Order)

### Sprint 1 — Core Loop (Days 1–2)
1. Data models + TypeScript interfaces
2. Agent registry (in-memory)
3. Task creation + basic state machine
4. Bid collection + scoring + winner selection
5. Simple task execution (no sub-tasks yet)
6. Payment intent creation + off-chain ledger

### Sprint 2 — Full Pipeline (Days 3–4)
7. Task decomposition into sub-tasks
8. Sub-agent bidding on sub-tasks
9. 402 Payment Required flow between agents
10. Compute sandbox with per-ms billing
11. WebSocket server + event broadcasting
12. Batch settlement logic (off-chain aggregation)

### Sprint 3 — On-Chain + UI (Days 5–6)
13. BatchSettlement.sol deployment on Arc testnet
14. Circle Programmable Wallets setup (user + agent wallets)
15. Settlement transaction submission + confirmation
16. Frontend: Task input + budget approval
17. Frontend: Bid war visualization
18. Frontend: Payment stream + compute meter

### Sprint 4 — Polish + Demo (Days 7–8)
19. Frontend: Cost breakdown + leaderboard
20. Frontend: Settlement proof + margin proof
21. Animations (Framer Motion for bid cards, payment stream)
22. End-to-end integration test
23. Demo script rehearsal
24. README + documentation

---

## 16 · Demo Script (Presenter Notes)

### Opening (15s)
"What if AI agents had wallets and competed for your money? SwarmPay is an autonomous compute marketplace where agents bid, collaborate, and settle micropayments on Arc."

### Live Demo (90s)
Follow Phase 1–8 exactly as specified in Section 5.

### Key Talking Points
- **At bidding:** "These agents are competing like freelancers. The cheapest AND most reliable agent wins."
- **At sub-bidding:** "The lead agent doesn't just assign work — it opens a sub-market. Even sub-tasks are competitive."
- **At payment stream:** "Every line you see is a real USDC micropayment. We've hit 60 transactions in under a minute."
- **At compute meter:** "This code is running in a sandbox and billing per millisecond. The agent signed a payment to access it."
- **At margin proof:** "On Ethereum, gas alone would cost $31 for these 63 payments. On Arc, it costs less than a tenth of a cent. This is why nanopayments need Arc."

### Closing (15s)
"SwarmPay proves that AI agents can autonomously operate an economy — bidding, earning, spending, and settling — when the chain makes it economically possible. Arc makes it possible."

---

## 17 · Open Questions / Flags

These need answers before or during build:

1. **Arc USDC availability:** Is USDC natively on Arc, or do we need a mock ERC-20 for demo?
2. **Circle on Arc:** Does Circle Programmable Wallets support Arc chain? If not, we simulate the wallet layer and settle on Arc separately.
3. **Agent intelligence:** For demo, are agents using real LLM calls or simulated decision trees? (Simulated is faster to build, real is more impressive.)
4. **Compute sandbox security:** For demo, is vm2 sufficient or do we need Docker containers? (vm2 is simpler, Docker is production-grade.)
5. **Real data vs mock:** Should research agents fetch real CoinGecko data, or use pre-loaded mock data? (Real is riskier but more impressive.)
6. **Judging format:** Is this a live demo with Q&A, recorded video, or both? This affects polish priorities.
7. **Team size:** How many developers? This affects sprint scope.

---

## 18 · Success Metrics (Demo Day)

| Metric | Target |
|--------|--------|
| End-to-end task completion | < 60s |
| Micropayments generated | 60+ |
| On-chain settlement txs | 1–2 |
| Settlement gas cost | < $0.001 |
| Agents participating | 5+ |
| Sub-task bidding rounds | 4+ |
| User budget utilization | < 40% (showing efficiency) |
| Zero crashes during demo | Required |
| Audience comprehension | "I understand what just happened" |

---

*End of PRD v1.0 — Ready for agent consumption.*
