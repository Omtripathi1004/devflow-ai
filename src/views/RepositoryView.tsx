import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { RepositoryFile } from '../types';
import {
  FolderTree,
  Folder,
  FolderOpen,
  FileCode,
  Search,
  FileEdit,
  Eye,
  ArrowRight,
} from 'lucide-react';

export const RepositoryView: React.FC = () => {
  const { repositoryFiles, selectedFilePath, setSelectedFilePath, setActiveTab } = useWorkflow();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    src: true,
    'src/services': true,
    'src/routes': true,
    tests: true,
    'tests/services': true,
    docs: true,
  });

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const findFileByPath = (files: RepositoryFile[], path: string): RepositoryFile | null => {
    for (const f of files) {
      if (f.path === path) return f;
      if (f.children) {
        const found = findFileByPath(f.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  const activeFile = selectedFilePath ? findFileByPath(repositoryFiles, selectedFilePath) : null;

  const renderTree = (files: RepositoryFile[], depth = 0) => {
    return (
      <div className="space-y-0.5">
        {files.map((file) => {
          if (file.type === 'dir') {
            const isExpanded = expandedFolders[file.path] ?? false;
            return (
              <div key={file.path}>
                <button
                  onClick={() => toggleFolder(file.path)}
                  className="w-full flex items-center gap-1.5 px-2 py-1 rounded text-xs text-slate-300 hover:bg-[#0D2135] font-mono text-left transition-colors"
                  style={{ paddingLeft: `${depth * 14 + 8}px` }}
                >
                  {isExpanded ? (
                    <FolderOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  ) : (
                    <Folder className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <span>{file.name}</span>
                </button>
                {isExpanded && file.children && renderTree(file.children, depth + 1)}
              </div>
            );
          }

          const isSelected = selectedFilePath === file.path;
          const isMatch = searchTerm === '' || file.name.toLowerCase().includes(searchTerm.toLowerCase());

          if (!isMatch) return null;

          return (
            <button
              key={file.path}
              onClick={() => setSelectedFilePath(file.path)}
              className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-xs font-mono transition-colors text-left ${
                isSelected
                  ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/35'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#0D2135]/60'
              }`}
              style={{ paddingLeft: `${depth * 14 + 8}px` }}
            >
              <div className="flex items-center gap-1.5 truncate">
                <FileCode className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{file.name}</span>
              </div>

              {file.status === 'modified' && (
                <span className="text-[9px] px-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/60 shrink-0">
                  MODIFIED
                </span>
              )}
              {file.status === 'inspected' && (
                <span className="text-[9px] px-1 rounded bg-[#06111F] text-slate-400 shrink-0">
                  INSPECTED
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 card-cyber p-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <FolderTree className="w-6 h-6 text-cyan-400" />
            <span>Repository Explorer & Symbol Context</span>
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Browse indexed codebase AST, view inspected caller graphs, and inspect files modified by Fix Agent.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <FileEdit className="w-4 h-4" />
            <span>Proposed Modification</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#94A3B8]">
            <Eye className="w-4 h-4" />
            <span>AST Inspected</span>
          </div>
        </div>
      </div>

      {/* Explorer Dual-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Tree Explorer */}
        <div className="lg:col-span-4 card-cyber flex flex-col overflow-hidden">
          {/* Search Bar */}
          <div className="p-3 border-b border-[rgba(148,163,184,0.15)] bg-[#071522]/80">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search repository files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#06111F] border border-[rgba(148,163,184,0.15)] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          {/* Tree View */}
          <div className="flex-1 p-3 overflow-y-auto max-h-[550px]">
            {renderTree(repositoryFiles)}
          </div>

          {/* Affected Symbol Summary */}
          <div className="p-3 border-t border-[rgba(148,163,184,0.15)] bg-[#071522]/90 text-xs space-y-1.5">
            <div className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
              AST Affected Scope (BUG-142)
            </div>
            <div className="text-[11px] text-slate-300 font-mono">
              • CsvUploadService.validateUpload (L42)
            </div>
            <div className="text-[11px] text-[#94A3B8] font-mono">
              • CsvUploadService.processFileStream (L61)
            </div>
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="lg:col-span-8 card-cyber flex flex-col overflow-hidden">
          {/* File Toolbar */}
          <div className="p-3 border-b border-[rgba(148,163,184,0.15)] bg-[#071522]/90 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-medium">{activeFile?.path || 'Select a file'}</span>
              {activeFile?.status === 'modified' && (
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px]">
                  PROPOSED PATCH APPLIED
                </span>
              )}
            </div>

            {activeFile?.status === 'modified' && (
              <button
                onClick={() => setActiveTab('code_changes')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-sans"
              >
                <span>Compare Git Diff</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Code Body */}
          <div className="flex-1 p-4 bg-[#06111F] overflow-auto max-h-[550px] font-mono text-xs text-slate-300 leading-relaxed">
            {activeFile?.content ? (
              <pre className="whitespace-pre">
                {activeFile.content.split('\n').map((line, idx) => {
                  const lineNum = idx + 1;
                  const isLine42 = activeFile.path.includes('csvUploadService.ts') && lineNum >= 42 && lineNum <= 58;

                  return (
                    <div
                      key={idx}
                      className={`flex items-start hover:bg-[#0D2135]/60 px-2 py-0.5 rounded ${
                        isLine42 ? 'bg-cyan-950/30 border-l-2 border-cyan-400 text-cyan-100' : ''
                      }`}
                    >
                      <span className="w-10 text-slate-600 select-none text-right pr-4 shrink-0">
                        {lineNum}
                      </span>
                      <span className="flex-1">{line}</span>
                    </div>
                  );
                })}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-64 text-[#94A3B8] font-sans">
                Select a file from the repository tree to inspect its source code.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
