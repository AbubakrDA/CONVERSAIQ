import React from 'react';
import { Users, Brain, History, HeartHandshake } from 'lucide-react';

export const CustomerManagementPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">Customer Management & Memory</h1>
          <p className="text-xs text-navy-muted">Phase 8 Platform Module • Customer profiles, interaction history, and semantic memory</p>
        </div>
        <span className="px-3 py-1 rounded-pill text-xs font-semibold bg-tealAccent-light text-tealAccent border border-tealAccent-border">
          Module C Placeholder
        </span>
      </div>

      <div className="bg-surface rounded-card p-8 border border-border-subtle shadow-card text-center max-w-2xl mx-auto space-y-4 my-8">
        <div className="w-14 h-14 rounded-full bg-tealAccent-light border border-tealAccent-border text-tealAccent flex items-center justify-center mx-auto">
          <Users className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-navy">Customer Memory & Profile Engine</h2>
        <p className="text-sm text-navy-secondary leading-relaxed">
          Manage unified customer records, working interaction context, episodic history (orders, prior questions), and durable semantic preferences with complete provenance and privacy controls.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-4">
          <div className="p-3 rounded-standard bg-canvas border border-border-subtle text-xs space-y-1">
            <span className="font-semibold text-navy flex items-center gap-1">
              <Brain className="w-3.5 h-3.5 text-tealAccent" /> Working Memory
            </span>
            <p className="text-navy-muted">Real-time session state</p>
          </div>
          <div className="p-3 rounded-standard bg-canvas border border-border-subtle text-xs space-y-1">
            <span className="font-semibold text-navy flex items-center gap-1">
              <History className="w-3.5 h-3.5 text-blueAccent" /> Episodic Memory
            </span>
            <p className="text-navy-muted">Historical interactions</p>
          </div>
          <div className="p-3 rounded-standard bg-canvas border border-border-subtle text-xs space-y-1">
            <span className="font-semibold text-navy flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-status-success" /> Semantic Memory
            </span>
            <p className="text-navy-muted">Customer preferences</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagementPage;
