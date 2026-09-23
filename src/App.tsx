import React from 'react';
import { WorkflowProvider, useWorkflow } from './context/WorkflowContext';
import { Header } from './components/Header';
import { SidebarNav } from './components/SidebarNav';
import { AgentDetailDrawer } from './components/AgentDetailDrawer';
import { JudgeTourModal } from './components/JudgeTourModal';

import { OverviewView } from './views/OverviewView';
import { WorkflowsView } from './views/WorkflowsView';
import { IssuesView } from './views/IssuesView';
import { AgentsView } from './views/AgentsView';
import { RepositoryView } from './views/RepositoryView';
import { DocumentsView } from './views/DocumentsView';
import { RootCauseView } from './views/RootCauseView';
import { CodeChangesView } from './views/CodeChangesView';
import { TestsView } from './views/TestsView';
import { CodeReviewView } from './views/CodeReviewView';
import { SecurityView } from './views/SecurityView';
import { ReleaseCenterView } from './views/ReleaseCenterView';
import { BenchmarksView } from './views/BenchmarksView';
import { ActivityView } from './views/ActivityView';
import { SettingsView } from './views/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab } = useWorkflow();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'workflows':
        return <WorkflowsView />;
      case 'issues':
        return <IssuesView />;
      case 'agents':
        return <AgentsView />;
      case 'repository':
        return <RepositoryView />;
      case 'documents':
        return <DocumentsView />;
      case 'root_cause':
        return <RootCauseView />;
      case 'code_changes':
        return <CodeChangesView />;
      case 'tests':
        return <TestsView />;
      case 'review':
        return <CodeReviewView />;
      case 'security':
        return <SecurityView />;
      case 'release':
        return <ReleaseCenterView />;
      case 'benchmarks':
        return <BenchmarksView />;
      case 'activity':
        return <ActivityView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#06111F] text-slate-100 font-sans micro-grid-bg">
      {/* Top Header */}
      <Header />

      {/* Main App Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Navigation Sidebar */}
        <SidebarNav />

        {/* Dynamic View Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          <div className="max-w-[1600px] mx-auto pb-16">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Slide-out Agent Telemetry Drawer */}
      <AgentDetailDrawer />

      {/* Interactive 11-Step Judge Tour Modal */}
      <JudgeTourModal />
    </div>
  );
};

export default function App() {
  return (
    <WorkflowProvider>
      <MainLayout />
    </WorkflowProvider>
  );
}
