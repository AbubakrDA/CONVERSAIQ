import React from 'react';
import { ShieldCheck, Sparkles, Layers } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-canvas flex flex-col items-center justify-center p-6 text-navy">
      <main className="w-full max-w-lg bg-surface-card rounded-card border border-surface-border shadow-card p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-tealAccent-50 border border-tealAccent-100 flex items-center justify-center text-tealAccent-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-navy">
              ConversaIQ
            </h1>
            <p className="text-xs text-surface-muted font-medium">
              Enterprise AI Customer Support & Business Intelligence
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-surface-canvas border border-surface-border">
            <div className="flex items-center space-x-2 text-sm font-semibold text-navy mb-1">
              <ShieldCheck className="w-4 h-4 text-tealAccent-500" />
              <span>Phase 1 — Task 1.1 Scaffolded</span>
            </div>
            <p className="text-xs text-surface-muted leading-relaxed">
              React 18 + TypeScript + Vite + Tailwind CSS runtime verified under Harness Engineering controls.
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-surface-muted border-t border-surface-border pt-4">
            <span className="flex items-center gap-1.5 font-medium">
              <Layers className="w-3.5 h-3.5 text-blueAccent-500" />
              Design Baseline
            </span>
            <span className="px-2 py-0.5 rounded-full bg-navy-50 text-navy-700 font-medium">
              Light Canvas • Rounded Cards • Navy & Teal
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
