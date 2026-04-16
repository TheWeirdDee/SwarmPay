'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Cpu, Search, Database, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Agent, AgentType } from '@/types';

const agentTypeIcons = {
  research: <Search className="w-4 h-4" />,
  analyzer: <Database className="w-4 h-4" />,
  compute: <Cpu className="w-4 h-4" />,
  orchestrator: <Code className="w-4 h-4" />,
};

export const AgentManager: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<AgentType>('research');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/agents');
      if (res.ok) {
        setAgents(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type }),
      });
      if (res.ok) {
        const newAgent = await res.json();
        setAgents((prev) => [...prev, newAgent]);
        setName('');
        setShowAddForm(false);
      }
    } catch (err) {
      console.error('Failed to add agent:', err);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl w-full max-w-4xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Users className="w-5 h-5 text-blue-400" />
          <h2>Agent Registry</h2>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-lg transition-colors border border-blue-500/20"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <form onSubmit={handleAddAgent} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Agent Name (e.g. Research-Alpha)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AgentType)}
                  className="bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 capitalize"
                >
                  <option value="research">Research</option>
                  <option value="analyzer">Analyzer</option>
                  <option value="compute">Compute</option>
                  <option value="orchestrator">Orchestrator</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
              >
                Register Agent
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full h-24 flex items-center justify-center text-slate-500">Loading agents...</div>
        ) : agents.length === 0 ? (
          <div className="col-span-full h-24 flex items-center justify-center text-slate-500">No agents registered.</div>
        ) : (
          agents.map((agent) => (
            <div
              key={agent.id}
              className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-slate-900 text-blue-400 rounded-md">
                  {agentTypeIcons[agent.type]}
                </div>
                <span className="text-white font-medium text-sm truncate">{agent.name}</span>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">{agent.type}</span>
                <span className="text-xs text-blue-400 font-mono tracking-tighter">Rep: {agent.reputation}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
