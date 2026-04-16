'use client';

import React, { useState, useEffect } from 'react';
import { TaskInput } from './TaskInput';
import { TaskList } from './TaskList';
import { AgentManager } from './AgentManager';
import { Task } from '@/types';
import { LayoutDashboard, Wallet, Zap } from 'lucide-react';

export const TaskDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [balance] = useState(5.00); // Mock Circle balance as per PRD Section 5

  useEffect(() => {
    fetchTasks();
    
    // Set up polling for tasks to reflect status changes and new bids
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 pb-20">
      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/40">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase italic">SwarmPay</span>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-2xl shadow-inner">
            <Wallet className="w-4 h-4 text-slate-400" />
            <span className="font-mono text-sm font-bold tracking-tight">
              ${balance.toFixed(2)} <span className="text-slate-500 text-[10px] ml-1">USDC</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl font-black text-white mb-4 tracking-tight"
          >
            Compute Marketplace
          </motion.h1>
          <p className="text-slate-500 text-lg max-w-lg mx-auto font-medium lowercase tracking-tight leading-relaxed">
            Autonomous agent economy. Distribute compute, settle instantly, optimize everything.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Activity Area */}
          <div className="lg:col-span-12 xl:col-span-12 space-y-12">
            <section>
              <TaskInput onTaskCreated={handleTaskCreated} />
            </section>
            
            <section>
              <AgentManager />
            </section>

            <section>
              <TaskList tasks={tasks} />
            </section>
          </div>
        </div>
      </main>

      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[0%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/5 rounded-full blur-[100px]" />
      </div>
    </div>
  );
};

// Internal Import for motion as it was missed in previous write but used in JSX
import { motion } from 'framer-motion';
