import { NextRequest, NextResponse } from 'next/server';
import { Sandbox } from '@e2b/sdk';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    
    if (!process.env.E2B_API_KEY) {
      return NextResponse.json({ error: 'E2B_API_KEY not configured' }, { status: 500 });
    }

    const sandbox = await Sandbox.create({ apiKey: process.env.E2B_API_KEY });
    
    const cleanCode = code.replace(/```[a-z]*\n?/g, '').trim();
    const componentName = cleanCode.match(/(?:function|const)\s+(\w+)/)?.[1] || 'App';
    
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { margin: 0; padding: 0; }</style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${cleanCode}
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(${componentName}));
  </script>
</body>
</html>`;

    await sandbox.filesystem.write('/index.html', html);
    
    await sandbox.process.start({
      cmd: 'python3 -m http.server 8000',
      cwd: '/'
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const url = sandbox.getHostname(8000);
    
    return NextResponse.json({ 
      sandboxId: sandbox.id,
      url: `https://${url}`,
      message: 'Sandbox created successfully'
    });
  } catch (error: any) {
    console.error('E2B Sandbox error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
