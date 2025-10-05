// src/components/PreviewPanel.tsx
‘use client’;

import { useState, useEffect } from ‘react’;
import { Loader2, ExternalLink, RefreshCw, AlertCircle } from ‘lucide-react’;

interface PreviewPanelProps {
code: string;
componentName: string;
isGenerating: boolean;
}

export default function PreviewPanel({ code, componentName, isGenerating }: PreviewPanelProps) {
const [previewUrl, setPreviewUrl] = useState<string | null>(null);
const [sandboxId, setSandboxId] = useState<string | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [retryCount, setRetryCount] = useState(0);

const createSandbox = async () => {
if (!code || !componentName) return;

```
setLoading(true);
setError(null);
setPreviewUrl(null);

try {
  const response = await fetch('/api/sandbox', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      componentName,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.details || data.error || 'Failed to create sandbox');
  }

  if (data.previewUrl) {
    setPreviewUrl(data.previewUrl);
    setSandboxId(data.sandboxId);
    setError(null);
    setRetryCount(0);
  } else {
    throw new Error('No preview URL received from sandbox');
  }
} catch (err: any) {
  console.error('Preview error:', err);
  setError(err.message || 'Failed to create preview');
  
  // Auto-retry up to 2 times
  if (retryCount < 2) {
    setTimeout(() => {
      setRetryCount(prev => prev + 1);
      createSandbox();
    }, 3000);
  }
} finally {
  setLoading(false);
}
```

};

// Auto-create sandbox when code is generated
useEffect(() => {
if (code && componentName && !isGenerating && !previewUrl && !loading) {
createSandbox();
}
}, [code, componentName, isGenerating]);

const handleRefresh = () => {
setRetryCount(0);
createSandbox();
};

const handleOpenInNewTab = () => {
if (previewUrl) {
window.open(previewUrl, ‘_blank’);
}
};

if (isGenerating) {
return (
<div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-50 to-slate-100">
<div className="text-center space-y-4">
<Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
<p className="text-slate-600 font-medium">Generating your application…</p>
<p className="text-sm text-slate-500">AI agents are building your component</p>
</div>
</div>
);
}

if (!code) {
return (
<div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-50 to-slate-100">
<div className="text-center space-y-3 max-w-md px-6">
<div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
<svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
</svg>
</div>
<h3 className="text-xl font-semibold text-slate-800">No Preview Yet</h3>
<p className="text-slate-600">
Enter a prompt and generate your app to see the live preview here
</p>
</div>
</div>
);
}

if (loading) {
return (
<div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-50 to-slate-100">
<div className="text-center space-y-4">
<Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
<p className="text-slate-600 font-medium">Creating live preview…</p>
<p className="text-sm text-slate-500">
Setting up sandbox environment
{retryCount > 0 && ` (Attempt ${retryCount + 1}/3)`}
</p>
</div>
</div>
);
}

if (error) {
return (
<div className="flex items-center justify-center h-full bg-gradient-to-br from-red-50 to-orange-50">
<div className="text-center space-y-4 max-w-md px-6">
<AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
<h3 className="text-xl font-semibold text-red-900">Preview Failed</h3>
<p className="text-red-700 text-sm">{error}</p>
<button
onClick={handleRefresh}
className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
>
<RefreshCw className="w-4 h-4" />
Retry Preview
</button>
</div>
</div>
);
}

if (previewUrl) {
return (
<div className="relative h-full flex flex-col">
{/* Preview Controls */}
<div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200">
<div className="flex items-center gap-2">
<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
<span className="text-sm font-medium text-slate-700">Live Preview</span>
</div>
<div className="flex items-center gap-2">
<button
onClick={handleRefresh}
className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
title="Refresh preview"
>
<RefreshCw className="w-4 h-4 text-slate-600" />
</button>
<button
onClick={handleOpenInNewTab}
className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
title="Open in new tab"
>
<ExternalLink className="w-4 h-4 text-slate-600" />
</button>
</div>
</div>

```
    {/* Preview iframe */}
    <iframe
      src={previewUrl}
      className="flex-1 w-full border-0"
      title="Live Preview"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      onError={() => {
        setError('Failed to load preview. The sandbox may have timed out.');
      }}
    />
  </div>
);
```

}

return null;
}
