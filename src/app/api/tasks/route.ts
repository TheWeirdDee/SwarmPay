import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { Task, TaskStatus, CostBreakdown } from '@/types';

export async function GET() {
  const tasks = store.getTasks();
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, budget, userId = 'user_1' } = body;

    if (!prompt || !budget) {
      return NextResponse.json({ error: 'Prompt and budget are required' }, { status: 400 });
    }

    const initialCostBreakdown: CostBreakdown = {
      research: 0,
      compute: 0,
      analysis: 0,
      platformFee: budget * 0.1, // Platform fee 10% as per PRD
      totalPayments: 0,
      totalCost: 0,
      userBudget: budget,
      userSavings: 0,
    };

    const newTask: Task = {
      id: crypto.randomUUID(),
      userId,
      prompt,
      budget,
      status: 'bidding',
      winningBid: null,
      subTasks: [],
      result: null,
      costBreakdown: initialCostBreakdown,
      createdAt: Date.now(),
      completedAt: null,
    };

    store.createTask(newTask);

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
