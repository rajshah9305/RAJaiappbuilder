// src/app/api/sandbox/route.ts
import { Sandbox } from ‘e2b’;
import { NextRequest, NextResponse } from ‘next/server’;

export const maxDuration = 60; // Maximum execution time for Vercel

export async function POST(req: NextRequest) {
try {
const { code, componentName } = await req.json();

```
if (!code || !componentName) {
  return NextResponse.json(
    { error: 'Missing code or componentName' },
    { status: 400 }
  );
}

console.log('Creating E2B sandbox...');

// Create E2B sandbox
const sandbox = await Sandbox.create({
  timeoutMs: 5 * 60 * 1000, // 5 minutes
  apiKey: process.env.E2B_API_KEY,
});

console.log('Sandbox created:', sandbox.sandboxId);

// Install required dependencies
console.log('Installing dependencies...');
await sandbox.commands.exec('npm install -g vite react react-dom');

// Create project structure
console.log('Setting up project structure...');
await sandbox.files.makeDir('/home/user/app');

// Create package.json
const packageJson = {
  name: 'preview-app',
  type: 'module',
  scripts: {
    dev: 'vite --host 0.0.0.0 --port 3000'
  },
  dependencies: {
    react: '^18.2.0',
    'react-dom': '^18.2.0'
  },
  devDependencies: {
    '@vitejs/plugin-react': '^4.2.1',
    vite: '^5.0.0'
  }
};

await sandbox.files.write(
  '/home/user/app/package.json',
  JSON.stringify(packageJson, null, 2)
);

// Create vite.config.js
const viteConfig = `
```

import { defineConfig } from ‘vite’
import react from ‘@vitejs/plugin-react’

export default defineConfig({
plugins: [react()],
server: {
host: ‘0.0.0.0’,
port: 3000,
strictPort: true
}
})
`;

```
await sandbox.files.write('/home/user/app/vite.config.js', viteConfig);

// Create index.html
const indexHtml = `
```

<!DOCTYPE html>

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Live Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;

```
await sandbox.files.write('/home/user/app/index.html', indexHtml);

// Create src directory
await sandbox.files.makeDir('/home/user/app/src');

// Write the generated component
await sandbox.files.write(`/home/user/app/src/${componentName}.jsx`, code);

// Create main.jsx that renders the component
const mainJsx = `
```

import React from ‘react’
import ReactDOM from ‘react-dom/client’
import ${componentName} from ‘./${componentName}.jsx’

ReactDOM.createRoot(document.getElementById(‘root’)).render(
<React.StrictMode>
<${componentName} />
</React.StrictMode>,
)
`;

```
await sandbox.files.write('/home/user/app/src/main.jsx', mainJsx);

// Install dependencies
console.log('Installing npm packages...');
await sandbox.commands.exec('cd /home/user/app && npm install', {
  timeout: 120000, // 2 minutes timeout
});

// Start the dev server in background
console.log('Starting dev server...');
sandbox.commands.exec('cd /home/user/app && npm run dev', {
  background: true,
  timeout: 180000, // 3 minutes timeout
});

// Wait for server to be ready
console.log('Waiting for server to be ready...');
await new Promise(resolve => setTimeout(resolve, 5000));

// Get the public URL for the sandbox
const previewUrl = `https://${sandbox.getHost(3000)}`;

console.log('Preview URL:', previewUrl);

return NextResponse.json({
  success: true,
  sandboxId: sandbox.sandboxId,
  previewUrl,
  message: 'Sandbox created and server started successfully',
});
```

} catch (error: any) {
console.error(‘Sandbox creation error:’, error);
return NextResponse.json(
{
error: ‘Failed to create sandbox’,
details: error.message,
stack: error.stack
},
{ status: 500 }
);
}
}

// Optional: Add a GET endpoint to check sandbox status
export async function GET(req: NextRequest) {
const sandboxId = req.nextUrl.searchParams.get(‘sandboxId’);

if (!sandboxId) {
return NextResponse.json({ error: ‘Missing sandboxId’ }, { status: 400 });
}

try {
const sandbox = await Sandbox.connect(sandboxId, {
apiKey: process.env.E2B_API_KEY,
});

```
const isRunning = await sandbox.isRunning();
const previewUrl = isRunning ? `https://${sandbox.getHost(3000)}` : null;

return NextResponse.json({
  sandboxId,
  isRunning,
  previewUrl,
});
```

} catch (error: any) {
return NextResponse.json(
{ error: ‘Failed to connect to sandbox’, details: error.message },
{ status: 500 }
);
}
}
