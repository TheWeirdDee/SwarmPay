import { Bid, Agent } from '@/types';

/**
 * Calculates a deterministic score for a bid based on the SwarmPay PRD formula.
 * 
 * Formula: score = (1/price) * reputation * (1/estimatedTime)
 * 
 * Note: Lower price, higher reputation, and faster time increase the score.
 */
export function calculateBidScore(bid: Bid, agent: Agent): number {
  if (!agent) {
    throw new Error('Agent is required for scoring');
  }

  // Guards for zero or negative values to prevent division by zero or nonsensical scores
  const price = Math.max(bid.price, 0.001); // Minimum $0.001 to prevent infinity
  const reputation = Math.max(agent.reputation, 1); // Minimum 1 reputation
  const timeMs = Math.max(bid.estimatedTimeMs, 1000); // Minimum 1 second (expressed in ms)

  // Convert time to seconds for more readable scoring
  const timeSec = timeMs / 1000;

  // score = (1/price) * reputation * (1/timeInSeconds)
  const score = (1 / price) * reputation * (1 / timeSec);

  return score;
}
