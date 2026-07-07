"use client";

import { useState } from "react";
import { Copy, Sparkles, Check, Loader2 } from "lucide-react";

export default function Home() {
  const [prospectBio, setProspectBio] = useState("");
  const [valueProp, setValueProp] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prospectBio || !valueProp) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    setGeneratedEmail("");
    
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectBio, valueProp }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate email");
      
      setGeneratedEmail(data.email.generated_email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-indigo-500/30 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-3xl w-full space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/20">
            <Sparkles className="w-5 h-5 text-indigo-400 mr-2" />
            <span className="text-sm font-medium text-indigo-300 tracking-wide uppercase">AI-Powered Sales</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            PitchPerfect AI
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Stop sending generic templates. Generate hyper-personalized cold emails that actually convert in seconds.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="space-y-2">
            <label htmlFor="prospectBio" className="block text-sm font-medium text-neutral-300">
              Prospect Background (LinkedIn Bio, Recent News, Context)
            </label>
            <textarea
              id="prospectBio"
              value={prospectBio}
              onChange={(e) => setProspectBio(e.target.value)}
              className="w-full h-32 bg-neutral-950/50 border border-white/10 rounded-xl p-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all resize-none"
              placeholder="e.g. John is the VP of Sales at Acme Corp. They recently raised a $10M Series A and are expanding into Europe."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="valueProp" className="block text-sm font-medium text-neutral-300">
              Your Value Proposition (What are you selling?)
            </label>
            <textarea
              id="valueProp"
              value={valueProp}
              onChange={(e) => setValueProp(e.target.value)}
              className="w-full h-24 bg-neutral-950/50 border border-white/10 rounded-xl p-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all resize-none"
              placeholder="e.g. We provide AI-driven translation services that help SaaS companies localize their product 10x faster."
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full relative group overflow-hidden rounded-xl bg-indigo-500 text-white font-medium py-4 px-4 transition-all hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <div className="flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {loading ? "Crafting your pitch..." : "Generate Perfect Pitch"}
            </div>
          </button>
        </form>

        {generatedEmail && (
          <div className="bg-neutral-900/80 backdrop-blur-xl border border-indigo-500/30 p-6 md:p-8 rounded-3xl shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Generated Email
              </h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium text-neutral-300"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-neutral-300 bg-transparent p-0 m-0 text-base leading-relaxed">
                {generatedEmail}
              </pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
