import React from 'react';
import { MessageSquare, Bot, UserCheck, Shield } from 'lucide-react';

export const AIChatAgentPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">AI Customer Support Chat</h1>
          <p className="text-xs text-navy-muted">Phase 5 Platform Module • Autonomous conversational AI and human handover</p>
        </div>
        <span className="px-3 py-1 rounded-pill text-xs font-semibold bg-tealAccent-light text-tealAccent border border-tealAccent-border">
          Module A Placeholder
        </span>
      </div>

      <div className="bg-surface rounded-card p-8 border border-border-subtle shadow-card text-center max-w-2xl mx-auto space-y-4 my-8">
        <div className="w-14 h-14 rounded-full bg-tealAccent-light border border-tealAccent-border text-tealAccent flex items-center justify-center mx-auto">
          <Bot className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-navy">Autonomous AI Chat Workspace</h2>
        <p className="text-sm text-navy-secondary leading-relaxed">
          This workspace will feature real-time multi-turn conversational AI, intent detection, sentiment scoring, customer memory recall, and seamless human agent handover.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-4">
          <div className="p-3 rounded-standard bg-canvas border border-border-subtle text-xs space-y-1">
            <span className="font-semibold text-navy flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-tealAccent" />
              Real-Time Chat
            </span>
            <p className="text-navy-muted">WebSocket streaming delivery</p>
          </div>
          <div className="p-3 rounded-standard bg-canvas border border-border-subtle text-xs space-y-1">
            <span className="font-semibold text-navy flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-blueAccent" />
              Human Handover
            </span>
            <p className="text-navy-muted">Smooth agent assignment</p>
          </div>
          <div className="p-3 rounded-standard bg-canvas border border-border-subtle text-xs space-y-1">
            <span className="font-semibold text-navy flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-status-success" />
              Guardrails
            </span>
            <p className="text-navy-muted">Prompt injection isolation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatAgentPage;
