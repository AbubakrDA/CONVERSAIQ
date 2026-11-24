import React from 'react';
import { Cloud, Server, Activity, ShieldAlert } from 'lucide-react';

export const CloudInfrastructurePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">Cloud & Infrastructure Dashboard</h1>
          <p className="text-xs text-navy-muted">Phase 14 Platform Module • Deployment telemetry, container metrics, and backup status</p>
        </div>
        <span className="px-3 py-1 rounded-pill text-xs font-semibold bg-tealAccent-light text-tealAccent border border-tealAccent-border">
          Module §8 & §14 Placeholder
        </span>
      </div>

      <div className="bg-surface rounded-card p-8 border border-border-subtle shadow-card text-center max-w-2xl mx-auto space-y-4 my-8">
        <div className="w-14 h-14 rounded-full bg-blueAccent-light border border-blueAccent-border text-blueAccent flex items-center justify-center mx-auto">
          <Cloud className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-navy">Multi-Tenant Cloud Control Plane</h2>
        <p className="text-sm text-navy-secondary leading-relaxed">
          Provides comprehensive infrastructure observability: ECS container health, PostgreSQL database load, S3 storage consumption, background Celery queue depth, and cloud cost allocation.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-4">
          <div className="p-3 rounded-standard bg-canvas border border-border-subtle text-xs space-y-1">
            <span className="font-semibold text-navy flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-status-success" /> Service Health
            </span>
            <p className="text-navy-muted">99.98% target uptime</p>
          </div>
          <div className="p-3 rounded-standard bg-canvas border border-border-subtle text-xs space-y-1">
            <span className="font-semibold text-navy flex items-center gap-1">
              <Server className="w-3.5 h-3.5 text-blueAccent" /> Storage Quota
            </span>
            <p className="text-navy-muted">Isolated tenant buckets</p>
          </div>
          <div className="p-3 rounded-standard bg-canvas border border-border-subtle text-xs space-y-1">
            <span className="font-semibold text-navy flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-tealAccent" /> Security Center
            </span>
            <p className="text-navy-muted">Automated threat telemetry</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudInfrastructurePage;
