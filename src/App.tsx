import React from 'react';
import { WorkflowProvider, useWorkflow } from './context/WorkflowContext';
import { Header } from './components/Header';
import { SidebarNav } from './components/SidebarNav';
import { AgentDetailDrawer } from './components/AgentDetailDrawer';
import { JudgeTourModal } from './components/JudgeTourModal';

import { OverviewView } from './views/OverviewView';
import { WorkflowsView } from './views/WorkflowsView';
import { AutomationHubView } from './views/AutomationHubView';
import { AICopilotView } from './views/AICopilotView';
import { IssuesView } from './views/IssuesView';
import { AgentsView } from './views/AgentsView';
import { RepositoryView } from './views/RepositoryView';
import { DocumentsView } from './views/DocumentsView';
import { RootCauseView } from './views/RootCauseView';
import { CodeChangesView } from './views/CodeChangesView';
import { TestsView } from './views/TestsView';
import { CodeReviewView } from './views/CodeReviewView';
import { SecurityView } from './views/SecurityView';
import { SystemDesignView } from './views/SystemDesignView';
import { PublicApisView } from './views/PublicApisView';
import { ReleaseCenterView } from './views/ReleaseCenterView';
import { BenchmarksView } from './views/BenchmarksView';
import { ActivityView } from './views/ActivityView';
import { SettingsView } from './views/SettingsView';
import { ProjectProgressView } from './views/ProjectProgressView';
import { GeminiChatView } from './views/GeminiChatView';
import { AuthView } from './views/AuthView';

const MainLayout: React.FC = () => {
  const { activeTab } = useWorkflow();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'project_progress':
        return <ProjectProgressView />;
      case 'gemini_chat':
        return <GeminiChatView />;
      case 'auth':
        return <AuthView />;
      case 'workflows':
        return <WorkflowsView />;
      case 'automation':
        return <AutomationHubView />;
      case 'copilot':
        return <AICopilotView />;
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
      case 'system_design':
        return <SystemDesignView />;
      case 'public_apis':
        return <PublicApisView />;
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
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 sm:px-5 md:px-8 pt-3 sm:pt-5 pb-28 md:pb-24 space-y-6 scroll-smooth w-full">
          <div className="max-w-[1600px] mx-auto w-full">
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
