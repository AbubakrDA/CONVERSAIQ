import React from 'react';
import { Database, Sheet, FileSpreadsheet, RefreshCw } from 'lucide-react';

export const BusinessDataHubPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">Business Data Hub</h1>
          <p className="text-xs text-navy-muted">Phase 4 Platform Module • Google Sheets, Excel/CSV, and relational connectors</p>
        </div>
        <span className="px-3 py-1 rounded-pill text-xs font-semibold bg-tealAccent-light text-tealAccent border border-tealAccent-border">
          Module E Placeholder
        </span>
      </div>

      <div className="bg-surface rounded-card p-8 border border-border-subtle shadow-card text-center max-w-2xl mx-auto space-y-4 my-8">
        <div className="w-14 h-14 rounded-full bg-tealAccent-light border border-tealAccent-border text-tealAccent flex items-center justify-center mx-auto">
          <Database className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-navy">Synchronized Business Data Sources</h2>
        <p className="text-sm text-navy-secondary leading-relaxed">
          Connect ConversaIQ directly to your actual operational data — Google Sheets, CSV uploads, CRM records, or existing PostgreSQL databases with read-only authorization.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-4">
          <div className="p-3 rounded-standard bg-canvas border border-border-subtle text-xs space-y-1">
            <span className="font-semibold text-navy flex items-center gap-1">
              <Sheet className="w-3.5 h-3.5 text-status-success" />
              Google Sheets
            </span>
            <p className="text-navy-muted">OAuth2 synchronization</p>
          </div>
          <div className="p-3 rounded-standard bg-canvas border border-border-subtle text-xs space-y-1">
            <span className="font-semibold text-navy flex items-center gap-1">
              <FileSpreadsheet className="w-3.5 h-3.5 text-blueAccent" />
              Excel & CSV
            </span>
            <p className="text-navy-muted">Schema mapping & validation</p>
          </div>
          <div className="p-3 rounded-standard bg-canvas border border-border-subtle text-xs space-y-1">
            <span className="font-semibold text-navy flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5 text-tealAccent" />
              Auto Sync
            </span>
            <p className="text-navy-muted">Scheduled sync cadence</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDataHubPage;
