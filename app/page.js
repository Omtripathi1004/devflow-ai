// File: /app/page.js - DevFlow AI Web Dashboard Integration
import React from 'react';
import DevFlowDashboard from '../src/components/DevFlowDashboard';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <DevFlowDashboard />
    </main>
  );
}
