import { Task, Bid, Agent } from '@/types';
import { calculateBidScore } from '../scoring';

/**
 * SwarmPay In-Memory Store
 * Simulates a database for the MVP Phase.
 */
class InMemoryStore {
  private tasks: Map<string, Task> = new Map();
  private bids: Map<string, Bid> = new Map();
  private agents: Map<string, Agent> = new Map();

  // Tasks
  createTask(task: Task): void {
    this.tasks.set(task.id, task);
  }

  getTasks(): Task[] {
    return Array.from(this.tasks.values()).sort((a, b) => b.createdAt - a.createdAt);
  }

  getTask(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  updateTask(id: string, updates: Partial<Task>): void {
    const task = this.tasks.get(id);
    if (task) {
      this.tasks.set(id, { ...task, ...updates });
    }
  }

  // Agents
  addAgent(agent: Agent): void {
    this.agents.set(agent.id, agent);
  }

  getAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  // Bids
  addBid(bid: Bid): void {
    this.bids.set(bid.id, bid);
  }

  getBidsForTask(taskId: string): Bid[] {
    return Array.from(this.bids.values()).filter(bid => bid.taskId === taskId);
  }

  // Selection Engine
  selectWinningBid(taskId: string): { bid: Bid, agent: Agent, score: number } {
    const task = this.getTask(taskId);
    if (!task) throw new Error('Task not found');

    const bids = this.getBidsForTask(taskId);
    if (bids.length === 0) throw new Error('No bids available for this task');

    const rankedBids = bids.map(bid => {
      const agent = this.agents.get(bid.agentId);
      if (!agent) return null;
      
      try {
        const score = calculateBidScore(bid, agent);
        return { bid, agent, score };
      } catch (err) {
        console.warn(`Skipping invalid bid ${bid.id}:`, err);
        return null;
      }
    }).filter((item): item is { bid: Bid, agent: Agent, score: number } => item !== null);

    if (rankedBids.length === 0) throw new Error('No valid agents found for bids');

    // Sort with deterministic tie-breaking
    return rankedBids.sort((a, b) => {
      // 1. Primary: Score (Descending)
      if (Math.abs(b.score - a.score) > 0.000001) {
        return b.score - a.score;
      }
      // 2. Secondary: Price (Ascending - cheaper wins)
      if (a.bid.price !== b.bid.price) {
        return a.bid.price - b.bid.price;
      }
      // 3. Tertiary: Reputation (Descending - more trusted wins)
      if (a.agent.reputation !== b.agent.reputation) {
        return b.agent.reputation - a.agent.reputation;
      }
      // 4. Quaternary: Estimated Time (Ascending - faster wins)
      if (a.bid.estimatedTimeMs !== b.bid.estimatedTimeMs) {
        return a.bid.estimatedTimeMs - b.bid.estimatedTimeMs;
      }
      // 5. Quinary: Submission Time (Ascending - earlier wins)
      return a.bid.submittedAt - b.bid.submittedAt;
    })[0];
  }

  assignWinningBid(taskId: string): void {
    const winner = this.selectWinningBid(taskId);
    const task = this.getTask(taskId);

    if (task && task.status === 'bidding') {
      // Atomic update of all selection-related fields
      this.updateTask(taskId, {
        winningBid: winner.bid.id,
        assignedAgentId: winner.agent.id,
        status: 'assigned'
      });
    } else {
      throw new Error(`Task ${taskId} is not in bidding state or not found`);
    }
  }
}

// Singleton instance
export const store = new InMemoryStore();
