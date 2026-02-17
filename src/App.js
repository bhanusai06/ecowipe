import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WipeWorkflowProvider } from './context/WipeWorkflowContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layouts
import MainLayout from './pages/MainLayout';
import WipeLayout from './components/wipe/WipeLayout';

// Auth Page
import AuthPage from './pages/AuthPage';

// Marketing Pages
import Home from './pages/Home';
import DashboardPage from './pages/Dashboard';
import Features from './pages/Features';
import TestimonialsPage from './pages/TestimonialsPage';
import FAQPage from './pages/FAQPage';
import NotFound from './pages/NotFound';



// Workflow Pages
import WipeLanding from './pages/wipe/WipeLanding';
import DeviceSelectionPage from './pages/wipe/DeviceSelectionPage';
import MethodSelectionPage from './pages/wipe/MethodSelectionPage';
import ExecuteCommandPage from './pages/wipe/ExecuteCommandPage';
import ProofUploadPage from './pages/wipe/ProofUploadPage';

function App() {
  return (
    <Router basename="/e-waste">
      <AuthProvider>
        <WipeWorkflowProvider>
          <Routes>
            {/* Public Auth Route */}
            <Route path="/login" element={<AuthPage />} />

            {/* Protected Dashboard/Home */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="features" element={<Features />} />
              <Route path="testimonials" element={<TestimonialsPage />} />
              <Route path="faq" element={<FAQPage />} />
            </Route>

            {/* Protected Wipe Workflow */}
            <Route path="/wipe" element={
              <ProtectedRoute>
                <WipeLayout />
              </ProtectedRoute>
            }>
              <Route index element={<WipeLanding />} />
              <Route path="device" element={<DeviceSelectionPage />} />
              <Route path="method" element={<MethodSelectionPage />} />
              <Route path="execute" element={<ExecuteCommandPage />} />
              <Route path="proof" element={<ProofUploadPage />} />
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </WipeWorkflowProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;