import React from 'react';
import { Cpu, ShieldCheck, Zap, Server } from 'lucide-react';

export const IntegrationsToolsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">Integrations & Tool Gateway</h1>
          <p className="text-xs text-navy-muted">Phase 12 Platform Module • Governed Tool Gateway, external MCP proxies, and human approval gates</p>
        </div>
        <span className="px-3 py-1 rounded-pill text-xs font-semibold bg-tealAccent-light text-tealAccent border border-tealAccent-border">
          Module §6 Placeholder
        </span>
      </div>

      <div className="bg-surface rounded-card p-8 border border-border-subtle shadow-card text-center max-w-2xl mx-auto space-y-4 my-8">
        <div className="w-14 h-14 rounded-full bg-tealAccent-light border border-tealAccent-border text-tealAccent flex items-center justify-center mx-auto">
          <Cpu className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-navy">Governed Tool Execution Gateway</h2>
        <p className="text-sm text-navy-secondary leading-relaxed">
          The Tool Gateway isolates AI models from direct database or system access. All tool calls require strict Pydantic schema validation, risk classification (Low / Medium / High), and human approval for high-risk operations.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-4">
          <div className="p-3 rounded-standard bg-canvas border border-border-subtle text-xs space-y-1">
            <span className="font-semibold text-navy flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-tealAccent" /> Risk Tiers
            </span>
            <p className="text-navy-muted">Approval gates for write actions</p>
          </div>
          <div className="p-3 rounded-standard bg-canvas border border-border-subtle text-xs space-y-1">
            <span className="font-semibold text-navy flex items-center gap-1">
              <Server className="w-3.5 h-3.5 text-blueAccent" /> MCP Proxy
            </span>
            <p className="text-navy-muted">Sandboxed external servers</p>
          </div>
          <div className="p-3 rounded-standard bg-canvas border border-border-subtle text-xs space-y-1">
            <span className="font-semibold text-navy flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-status-warning" /> Rate Limiting
            </span>
            <p className="text-navy-muted">Token & concurrency limits</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsToolsPage;
