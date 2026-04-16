/**
 * SwarmPay Core Types
 * Based on SwarmPay PRD Master Section 4.1
 * 
 * STRICT CONTRACTS: Do not deviate from the PRD.
 */

// ─── Enums ──────────────────────────────────────────

export type TaskStatus = 'pending' | 'bidding' | 'assigned' | 'executing' | 'completed' | 'failed';

export type SubTaskType = 'fetch_data' | 'clean_data' | 'analyze' | 'compute' | 'summarize';

export type SubTaskStatus = 'open' | 'bidding' | 'assigned' | 'running' | 'completed' | 'failed';

export type AgentType = 'research' | 'analyzer' | 'compute' | 'orchestrator';

// ─── Core Entities ──────────────────────────────────

export interface CostBreakdown {
  research: number;
  compute: number;
  analysis: number;
  platformFee: number;
  totalPayments: number;        // Count of micropayments
  totalCost: number;
  userBudget: number;
  userSavings: number;
}

export interface Task {
  id: string;                    // UUID
  userId: string;
  prompt: string;                // "Summarize top crypto opportunities"
  budget: number;                // 0.30 (USDC)
  status: TaskStatus;           // pending | bidding | executing | completed | failed
  winningBid: string | null;    // Bid ID
  assignedAgentId: string | null; // Agent ID
  subTasks: SubTask[];
  result: string | null;
  costBreakdown: CostBreakdown;
  createdAt: number;
  completedAt: number | null;
}

export interface Bid {
  id: string;
  taskId: string;
  agentId: string;
  price: number;                // Agent's quoted price in USDC
  estimatedTimeMs: number;
  confidence: number;           // 0-1
  strategy: string;             // Brief description of approach
  submittedAt: number;
}

export interface SubTask {
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
  result: any;                  // PRD lists this as 'any' in Section 4.1
}

export interface SubBid {
  id: string;
  subTaskId: string;
  agentId: string;
  price: number;
  submittedAt: number;
}

export interface Agent {
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

export interface PaymentIntent {
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

export interface SettlementBatch {
  id: string;
  taskId: string;
  payments: PaymentIntent[];
  totalAmount: number;
  txHash: string | null;
  status: 'pending' | 'submitted' | 'confirmed' | 'failed';
  createdAt: number;
  confirmedAt: number | null;
}

export interface ComputeSession {
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

export interface LeaderboardEntry {
  agentId: string;
  agentName: string;
  totalEarned: number;
  tasksWon: number;
  avgBidPrice: number;
  winRate: number;              // percentage
  reputation: number;
}
