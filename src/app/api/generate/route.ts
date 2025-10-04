import { NextRequest, NextResponse } from 'next/server';
import { kickoff_crew } from '@/lib/ai/orchestrator';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: 'missing prompt' }, { status: 400 });

    const { jsx, test, spec, arch } = await kickoff_crew(prompt);

    const project = await prisma.project.create({ data: { prompt } });
    const build = await prisma.build.create({
      data: { projectId: project.id, status: 'success', previewUrl: '#' }
    });

    return NextResponse.json({ 
      buildId: build.id, 
      jsx, 
      test,
      spec,
      arch
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
