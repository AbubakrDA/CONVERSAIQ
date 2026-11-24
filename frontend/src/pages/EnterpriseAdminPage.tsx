import React from 'react';
import { Settings, Users, Shield, Palette } from 'lucide-react';

export const EnterpriseAdminPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">Enterprise Administration</h1>
          <p className="text-xs text-navy-muted">Phase 13 Platform Module • Tenant settings, custom branding, RBAC, and audit logs</p>
        </div>
        <span className="px-3 py-1 rounded-pill text-xs font-semibold bg-tealAccent-light text-tealAccent border border-tealAccent-border">
          Module J Placeholder
        </span>
      </div>

      <div className="bg-surface rounded-card p-8 border border-border-subtle shadow-card text-center max-w-2xl mx-auto space-y-4 my-8">
        <div className="w-14 h-14 rounded-full bg-tealAccent-light border border-tealAccent-border text-tealAccent flex items-center justify-center mx-auto">
          <Settings className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-navy">Tenant Governance & Security Administration</h2>
        <p className="text-sm text-navy-secondary leading-relaxed">
          Manage organization profiles, corporate branding and logos, user roles and fine-grained permissions, Keycloak SSO integration, data retention schedules, and immutable security audit logs.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-4">
          <div className="p-3 rounded-standard bg-canvas border border-border-subtle text-xs space-y-1">
            <span className="font-semibold text-navy flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-tealAccent" /> Brand Customization
            </span>
            <p className="text-navy-muted">Logos, palettes & domain</p>
          </div>
          <div className="p-3 rounded-standard bg-canvas border border-border-subtle text-xs space-y-1">
            <span className="font-semibold text-navy flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-blueAccent" /> User & Role RBAC
            </span>
            <p className="text-navy-muted">Granular permissions</p>
          </div>
          <div className="p-3 rounded-standard bg-canvas border border-border-subtle text-xs space-y-1">
            <span className="font-semibold text-navy flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-status-success" /> Audit Logs
            </span>
            <p className="text-navy-muted">Immutable compliance trails</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseAdminPage;
