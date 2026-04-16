import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const task = store.getTask(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (task.status !== 'bidding') {
      return NextResponse.json({ error: 'Task is not in bidding state' }, { status: 400 });
    }

    const bids = store.getBidsForTask(id);
    if (bids.length === 0) {
      return NextResponse.json({ error: 'Cannot select winner: No bids submitted' }, { status: 400 });
    }

    try {
      store.assignWinningBid(id);
      
      const updatedTask = store.getTask(id);
      const winner = store.selectWinningBid(id); // Re-calculate or fetch to return info

      return NextResponse.json({
        message: 'Winner selected successfully',
        task: updatedTask,
        winner: {
          agent: winner.agent.name,
          bidId: winner.bid.id,
          price: winner.bid.price,
          score: winner.score
        }
      });
    } catch (err: any) {
      return NextResponse.json({ error: err.message || 'Selection failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in selection API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
