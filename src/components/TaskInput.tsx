'use client';

import React, { useState } from 'react';
import { Send, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskInputProps {
  onTaskCreated: (task: any) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onTaskCreated }) => {
  const [prompt, setPrompt] = useState('');
  const [budget, setBudget] = useState('0.30');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || !budget) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, budget: parseFloat(budget) }),
      });

      if (response.ok) {
        const newTask = await response.json();
        onTaskCreated(newTask);
        setPrompt('');
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl shadow-black/50"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What should the agents compute?"
            className="w-full h-32 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all"
            required
          />
        </div>
        
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
            <DollarSign className="w-4 h-4 text-slate-400 mr-1" />
            <input
              type="number"
              step="0.01"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="bg-transparent text-slate-100 focus:outline-none w-20 text-sm"
              placeholder="Budget"
              required
            />
            <span className="text-xs text-slate-500 ml-2">USDC</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Submit Task</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};
