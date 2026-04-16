'use client';

import React, { useState, useEffect } from 'react';
import { Gavel, DollarSign, Send, User } from 'lucide-react';
import { Agent, Bid } from '@/types';

interface BidFormProps {
  taskId: string;
  onBidSubmitted: (bid: Bid) => void;
}

export const BidForm: React.FC<BidFormProps> = ({ taskId, onBidSubmitted }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [price, setPrice] = useState('0.20');
  const [strategy, setStrategy] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/agents')
      .then(res => res.json())
      .then(setAgents)
      .catch(err => console.error('Failed to fetch agents:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgentId || !price || !strategy) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          agentId: selectedAgentId,
          price: parseFloat(price),
          strategy,
        }),
      });

      if (res.ok) {
        const newBid = await res.json();
        onBidSubmitted(newBid);
        setStrategy('');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to submit bid');
      }
    } catch (err) {
      console.error('Error submitting bid:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (agents.length === 0) {
    return (
      <div className="text-xs text-slate-500 italic p-3 text-center border border-dashed border-slate-800 rounded-lg">
        Register an agent to submit a bid.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-3 mt-4">
      <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
        <Gavel className="w-3 h-3" />
        <span>Submit Agent Bid</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <User className="absolute left-2 top-1.5 w-3 h-3 text-slate-500" />
          <select
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="w-full pl-7 pr-2 py-1.5 bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
            required
          >
            <option value="">Select Agent</option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>{agent.name}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <DollarSign className="absolute left-2 top-1.5 w-3 h-3 text-slate-500" />
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full pl-7 pr-2 py-1.5 bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
            placeholder="Price"
          />
        </div>
      </div>

      <input
        type="text"
        value={strategy}
        onChange={(e) => setStrategy(e.target.value)}
        placeholder="Bidding strategy (e.g., Optimized data scraping)"
        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        required
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-colors"
      >
        {isSubmitting ? 'Submitting...' : (
          <>
            Submit Bid <Send className="w-3 h-3" />
          </>
        )}
      </button>
    </form>
  );
};
