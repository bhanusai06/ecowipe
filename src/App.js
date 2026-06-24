import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
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
import UserProfile from './pages/UserProfile';
import Features from './pages/Features';
import TestimonialsPage from './pages/TestimonialsPage';
import ComplianceGuide from './pages/ComplianceGuide';
import FAQPage from './pages/FAQPage';
import NotFound from './pages/NotFound';
import LiveOSDownload from './pages/LiveOSDownload';

// Workflow Pages
import WipeLanding from './pages/wipe/WipeLanding';
import DeviceSelectionPage from './pages/wipe/DeviceSelectionPage';
import MethodSelectionPage from './pages/wipe/MethodSelectionPage';
import ExecuteCommandPage from './pages/wipe/ExecuteCommandPage';
import ProofUploadPage from './pages/wipe/ProofUploadPage';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || "197014643450-5gvp19crr5rsdkhuc2phfvb528cdh8e9.apps.googleusercontent.com"}>
      <Router basename={process.env.PUBLIC_URL || "/"}>
        <AuthProvider>
          <WipeWorkflowProvider>
            <Routes>
              {/* Public Auth Route */}
              <Route path="/login" element={<AuthPage />} />

              {/* Public Marketing Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="features" element={<Features />} />
                <Route path="testimonials" element={<TestimonialsPage />} />
                <Route path="compliance" element={<ComplianceGuide />} />
                <Route path="faq" element={<FAQPage />} />
                <Route path="live-os-download" element={<LiveOSDownload />} />
              </Route>

              {/* Protected Dashboard Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<DashboardPage />} />
                <Route path="profile" element={<UserProfile />} />
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
      </Router >
    </GoogleOAuthProvider>
  );
}

export default App;