import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    
    // For now, return a mock response since the E2B SDK usage needs proper configuration
    // This allows the build to succeed while we implement the proper sandbox functionality
    
    return NextResponse.json({ 
      sandboxId: 'mock-sandbox-' + Date.now(),
      url: 'https://example.com',
      message: 'Sandbox functionality will be implemented with proper E2B SDK configuration'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
