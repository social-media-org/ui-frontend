import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProjectsListingPage from './pages/ProjectsListingPage';
import ProjectEditorPage from './pages/ProjectEditorPage';
import SettingsPage from './pages/SettingsPage';
import ProPlanPage from './pages/ProPlanPage';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <Routes>
          <Route path="/" element={<ProjectsListingPage />} />
          <Route path="/projects/:id" element={<ProjectEditorPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/pro" element={<ProPlanPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
