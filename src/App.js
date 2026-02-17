import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WipeWorkflowProvider } from './context/WipeWorkflowContext';

// Layouts
import MainLayout from './pages/MainLayout';
import WipeLayout from './components/wipe/WipeLayout';

// Marketing Pages
import Home from './pages/Home';
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
      <WipeWorkflowProvider>
        <Routes>
          {/* Marketing Pages with Navigation */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="features" element={<Features />} />
            <Route path="testimonials" element={<TestimonialsPage />} />
            <Route path="faq" element={<FAQPage />} />
          </Route>

          {/* Wipe Workflow Pages */}
          <Route path="/wipe" element={<WipeLayout />}>
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
    </Router>
  );
}

export default App;