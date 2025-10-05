import { NextRequest, NextResponse } from 'next/server';
import { kickoff_crew } from '@/lib/ai/orchestrator';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: 'missing prompt' }, { status: 400 });

    const { jsx, test, spec, arch } = await kickoff_crew(prompt);

    return NextResponse.json({ jsx, test, spec, arch });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
