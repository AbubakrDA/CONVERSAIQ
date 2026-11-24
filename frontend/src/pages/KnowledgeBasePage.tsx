import React from 'react';
import { BookOpen, FileText, UploadCloud, Search } from 'lucide-react';

export const KnowledgeBasePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">Knowledge Base & RAG</h1>
          <p className="text-xs text-navy-muted">Phase 7 Platform Module • Document ingestion, embeddings, and hybrid retrieval</p>
        </div>
        <span className="px-3 py-1 rounded-pill text-xs font-semibold bg-tealAccent-light text-tealAccent border border-tealAccent-border">
          Module D Placeholder
        </span>
      </div>

      <div className="bg-surface rounded-card p-8 border border-border-subtle shadow-card text-center max-w-2xl mx-auto space-y-4 my-8">
        <div className="w-14 h-14 rounded-full bg-blueAccent-light border border-blueAccent-border text-blueAccent flex items-center justify-center mx-auto">
          <BookOpen className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-navy">Enterprise Knowledge Ingestion</h2>
        <p className="text-sm text-navy-secondary leading-relaxed">
          Knowledge base management supports multi-format documents (PDF, DOCX, TXT, CSV, HTML, Markdown), pgvector chunk embeddings, hybrid retrieval, and precise source citations.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-standard bg-canvas border border-border-subtle text-xs text-navy font-medium">
            <UploadCloud className="w-3.5 h-3.5 text-tealAccent" /> Document Ingestion
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-standard bg-canvas border border-border-subtle text-xs text-navy font-medium">
            <Search className="w-3.5 h-3.5 text-blueAccent" /> Hybrid Semantic Search
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-standard bg-canvas border border-border-subtle text-xs text-navy font-medium">
            <FileText className="w-3.5 h-3.5 text-status-success" /> pgvector Embeddings
          </span>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBasePage;
