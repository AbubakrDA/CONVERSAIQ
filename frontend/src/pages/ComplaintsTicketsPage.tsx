import React from 'react';
import { LifeBuoy, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export const ComplaintsTicketsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">Complaints & Ticket Management</h1>
          <p className="text-xs text-navy-muted">Phase 9 Platform Module • Issue lifecycle, escalation, SLA tracking, and customer feedback</p>
        </div>
        <span className="px-3 py-1 rounded-pill text-xs font-semibold bg-tealAccent-light text-tealAccent border border-tealAccent-border">
          Module F & G Placeholder
        </span>
      </div>

      <div className="bg-surface rounded-card p-8 border border-border-subtle shadow-card text-center max-w-2xl mx-auto space-y-4 my-8">
        <div className="w-14 h-14 rounded-full bg-blueAccent-light border border-blueAccent-border text-blueAccent flex items-center justify-center mx-auto">
          <LifeBuoy className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-navy">Formal Ticket Lifecycle & Feedback</h2>
        <p className="text-sm text-navy-secondary leading-relaxed">
          Full complaint tracking across 8 lifecycle stages (New → Categorized → Assigned → In Progress → Waiting → Escalated → Resolved → Closed) with WhatsApp and Email feedback surveys.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-4">
          <div className="p-3 rounded-standard bg-canvas border border-border-subtle text-xs space-y-1">
            <span className="font-semibold text-navy flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-status-warning" /> SLA Tracking
            </span>
            <p className="text-navy-muted">Resolution time metrics</p>
          </div>
          <div className="p-3 rounded-standard bg-canvas border border-border-subtle text-xs space-y-1">
            <span className="font-semibold text-navy flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-status-danger" /> Auto Triage
            </span>
            <p className="text-navy-muted">Priority classification</p>
          </div>
          <div className="p-3 rounded-standard bg-canvas border border-border-subtle text-xs space-y-1">
            <span className="font-semibold text-navy flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-status-success" /> Feedback Loop
            </span>
            <p className="text-navy-muted">WhatsApp & Email CSAT</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsTicketsPage;
