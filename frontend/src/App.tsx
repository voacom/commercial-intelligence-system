import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FeaturePage from './pages/FeaturePage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
        
        {/* Feature Routes mapped to categories */}
        <Route path="design/:featureId" element={<FeaturePage />} />
        <Route path="growth/:featureId" element={<FeaturePage />} />
        <Route path="sales/:featureId" element={<FeaturePage />} />
        
        {/* Fallback routes for main nav items (placeholder for now) */}
        <Route path="design" element={<Navigate to="/design/manual" replace />} />
        <Route path="growth" element={<Navigate to="/growth/geo" replace />} />
        <Route path="sales" element={<Navigate to="/sales/live" replace />} />
        
        {/* Placeholder for other nav items */}
        <Route path="crm" element={<FeaturePage />} />
        <Route path="ai" element={<FeaturePage />} />
        
        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
    </AuthProvider>
  );
}

export default App;