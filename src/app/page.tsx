"use client";

import { useState } from "react";
import { Sparkles, Code2, Eye } from "lucide-react";
import PreviewPanel from "@/components/PreviewPanel";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [componentName, setComponentName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [agentLogs, setAgentLogs] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedCode("");
    setComponentName("");
    setAgentLogs([]);
    setShowCode(false);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate code");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response stream");
      }

      let code = "";
      let name = "";
      let logs: string[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "log") {
                logs = [...logs, data.message];
                setAgentLogs(logs);
              } else if (data.type === "code") {
                code = data.code;
                name = data.componentName;
                setGeneratedCode(code);
                setComponentName(name);
              } else if (data.type === "error") {
                throw new Error(data.message);
              }
            } catch (e) {
              console.error("Error parsing chunk:", e);
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      setAgentLogs(prev => [...prev, `Error: ${error.message}`]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">RAJ AI APP BUILDER</h1>
                <p className="text-sm text-blue-200">Elite AI-Powered Application Generator</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          <label className="block text-sm font-medium text-blue-200 mb-3">
            Describe Your Application
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="E.g., Create a beautiful todo list with drag and drop..."
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isGenerating}
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>

        {agentLogs.length > 0 && (
          <div className="mb-8 bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              AI Agents Working
            </h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {agentLogs.map((log, index) => (
                <div
                  key={index}
                  className="text-sm text-blue-200 font-mono bg-white/5 px-3 py-2 rounded-lg"
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                Generated Code
              </h2>
              {generatedCode && (
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
                >
                  {showCode ? "Hide" : "Show"} Code
                </button>
              )}
            </div>
            <div className="p-6">
              {!generatedCode ? (
                <div className="flex items-center justify-center h-96 text-blue-200">
                  <div className="text-center space-y-3">
                    <Code2 className="w-12 h-12 mx-auto opacity-50" />
                    <p>No code generated yet</p>
                    <p className="text-sm text-blue-300/70">
                      Enter a prompt and generate your app to see the code here
                    </p>
                  </div>
                </div>
              ) : showCode ? (
                <pre className="text-sm text-blue-100 font-mono overflow-auto max-h-[600px] bg-black/30 p-4 rounded-lg">
                  <code>{generatedCode}</code>
                </pre>
              ) : (
                <div className="flex items-center justify-center h-96 text-blue-200">
                  <div className="text-center space-y-3">
                    <Code2 className="w-12 h-12 mx-auto opacity-50" />
                    <p>Code hidden</p>
                    <p className="text-sm text-blue-300/70">
                      Click &ldquo;Show Code&rdquo; to view the generated code
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Live Preview
              </h2>
            </div>
            <div className="h-[600px] bg-white">
              <PreviewPanel
                code={generatedCode}
                componentName={componentName}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
