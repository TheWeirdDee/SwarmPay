'use client';

import React, { useState, useEffect } from 'react';
import { Task, Bid } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, Loader2, Gavel, TrendingUp } from 'lucide-react';
import { BidForm } from './BidForm';

interface TaskListProps {
  tasks: Task[];
}

const statusIcons = {
  pending: <Clock className="w-4 h-4 text-slate-400" />,
  bidding: <TrendingUp className="w-4 h-4 text-blue-400 animate-pulse" />,
  assigned: <Gavel className="w-4 h-4 text-purple-400" />,
  executing: <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />,
  completed: <CheckCircle2 className="w-4 h-4 text-green-400" />,
  failed: <AlertCircle className="w-4 h-4 text-red-400" />,
};

export const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const [bids, setBids] = useState<(Bid & { agentName?: string })[]>([]);
  const [showBidForm, setShowBidForm] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    if (task.status === 'bidding' || task.status === 'assigned' || task.status === 'completed' || task.status === 'executing') {
      fetch(`/api/tasks/${task.id}/bids`)
        .then(res => res.json())
        .then(setBids)
        .catch(err => console.error('Failed to fetch bids:', err));
    }
  }, [task.id, task.status]);

  const handleBidSubmitted = (newBid: Bid) => {
    // Refresh bids list
    fetch(`/api/tasks/${task.id}/bids`)
      .then(res => res.json())
      .then(setBids);
    setShowBidForm(false);
  };

  const selectWinner = async () => {
    if (isSelecting) return;
    setIsSelecting(true);
    
    try {
      const res = await fetch(`/api/tasks/${task.id}/select`, { method: 'POST' });
      if (res.ok) {
        // Parent dashboard polling will handle the task status update
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to select winner');
      }
    } catch (err) {
      console.error('Error selecting winner:', err);
    } finally {
      setIsSelecting(false);
    }
  };

  const winningBid = bids.find(b => b.id === task.winningBid);
  
  // Calculate relative scores for display if in bidding state
  const bidsWithScores = bids.map(b => {
    // Note: Actual scoring logic is on server, this is for UI transparency
    // In a real app we'd fetch these or have a shared lib
    return b;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 bg-slate-900 border border-slate-800 rounded-2xl group hover:border-slate-700 transition-all flex flex-col gap-4 shadow-lg shadow-black/20"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-slate-100 font-semibold leading-relaxed line-clamp-2">{task.prompt}</p>
          <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {new Date(task.createdAt).toLocaleTimeString()}
            </span>
            <span className="w-1 h-1 bg-slate-700 rounded-full" />
            <span className="font-mono text-blue-400 bg-blue-400/5 px-2 py-0.5 rounded border border-blue-400/20">
              ${task.budget.toFixed(2)} USDC
            </span>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-tighter
          ${task.status === 'pending' ? 'bg-slate-950 border-slate-800 text-slate-400' : ''}
          ${task.status === 'bidding' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : ''}
          ${task.status === 'assigned' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : ''}
          ${task.status === 'executing' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' : ''}
          ${task.status === 'completed' ? 'bg-green-500/10 border-green-500/20 text-green-400' : ''}
          ${task.status === 'failed' ? 'bg-red-500/10 border-red-500/20 text-red-400' : ''}
        `}>
          {statusIcons[task.status as keyof typeof statusIcons]}
          {task.status}
        </div>
      </div>

      {task.status === 'bidding' && bids.length > 0 && (
        <div className="border-t border-slate-800 pt-4 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            <div className="flex items-center gap-2">
              <Gavel className="w-3 h-3" />
              <span>Active Bids ({bids.length})</span>
            </div>
            <span>Agent Pool</span>
          </div>
          <div className="grid gap-2">
            {bids.map(bid => (
              <div key={bid.id} className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs">
                <div className="flex flex-col">
                  <span className="text-slate-200 font-semibold">{bid.agentName || 'Agent'}</span>
                  <span className="text-[10px] text-slate-500 italic mt-0.5">{bid.strategy}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-blue-400 font-mono font-bold">${bid.price.toFixed(2)}</span>
                  <div className="w-px h-3 bg-slate-800" />
                  <span className="text-slate-500 text-[10px]">{bid.estimatedTimeMs / 1000}s</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {task.status === 'assigned' && winningBid && (
        <div className="mt-4 p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Winning Agent</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-purple-500/10 rounded-full border border-purple-500/10">
              <span className="text-[10px] font-bold text-purple-400">WINNER</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-white font-bold">{winningBid.agentName}</span>
              <span className="text-[11px] text-slate-500 mt-0.5">{winningBid.strategy}</span>
            </div>
            <div className="text-right">
              <div className="font-mono text-purple-400 font-bold">${winningBid.price.toFixed(2)}</div>
              <div className="text-[10px] text-slate-600 mt-1 uppercase font-black">Decision Confirmed</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-purple-500/10 flex justify-between items-center text-[10px]">
             <span className="text-slate-500 uppercase font-bold tracking-tighter">Economic Score</span>
             <span className="font-mono text-purple-400/80">Deterministically Ranked #1</span>
          </div>
        </div>
      )}

      {task.status === 'bidding' && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {!showBidForm ? (
              <button
                disabled={isSelecting}
                onClick={() => setShowBidForm(true)}
                className="col-span-1 h-10 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-blue-400 hover:bg-blue-400/5 border border-dashed border-slate-800 hover:border-blue-400/30 rounded-xl transition-all disabled:opacity-50"
              >
                + Place Bid
              </button>
            ) : (
              <div className="col-span-2">
                <BidForm taskId={task.id} onBidSubmitted={handleBidSubmitted} />
              </div>
            )}
            
            {!showBidForm && bids.length > 0 && (
              <button
                disabled={isSelecting}
                onClick={selectWinner}
                className="col-span-1 h-10 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20"
              >
                {isSelecting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Gavel className="w-3.5 h-3.5" />
                )}
                {isSelecting ? 'Selecting...' : 'Select Winner'}
              </button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-slate-600 border border-dashed border-slate-800 rounded-3xl mt-8">
        No compute tasks live in the network.
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto mt-8">
      <div className="flex items-center justify-between px-1 mb-4">
        <h2 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
          Compute Stream
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Live</span>
        </div>
      </div>
      <div className="grid gap-6">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};
