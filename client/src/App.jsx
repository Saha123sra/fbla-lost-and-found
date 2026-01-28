import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from "./components/ChatBot";

// Pages
import Home from './pages/Home';
import Browse from './pages/Browse';
import ItemDetail from './pages/ItemDetail';
import Report from './pages/Report';
import Claim from './pages/Claim';
import Login from './pages/Login';
import StudentLogin from './pages/StudentLogin';
import AdminLogin from './pages/AdminLogin';
import StudentRegister from './pages/StudentRegister';
import AdminRegister from './pages/AdminRegister';
import MyClaims from './pages/MyClaims';
import AdminDashboard from './pages/AdminDashboard';
import FAQ from './pages/FAQ';
import Request from './pages/Request';
import MyRequests from './pages/MyRequests';
import OwnerLogin from './pages/OwnerLogin';
import OwnerDashboard from './pages/OwnerDashboard';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Protected route wrapper
const ProtectedRoute = ({ children, adminOnly = false, ownerOnly = false }) => {
  const { isAuthenticated, isAdmin, isOwner, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (ownerOnly && !isOwner) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-navy-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/student" element={<StudentLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/login/owner" element={<OwnerLogin />} />
          <Route path="/register" element={<Navigate to="/register/student" replace />} />
          <Route path="/register/student" element={<StudentRegister />} />
          <Route path="/register/admin" element={<AdminRegister />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected routes */}
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            }
          />
          <Route
            path="/claim/:itemId"
            element={
              <ProtectedRoute>
                <Claim />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-claims"
            element={
              <ProtectedRoute>
                <MyClaims />
              </ProtectedRoute>
            }
          />
          <Route
            path="/request"
            element={
              <ProtectedRoute>
                <Request />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-requests"
            element={
              <ProtectedRoute>
                <MyRequests />
              </ProtectedRoute>
            }
          />
          {/* Admin routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Owner routes */}
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute ownerOnly>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-300">404</h1>
                  <p className="text-xl text-gray-600 mt-4">Page not found</p>
                  <a
                    href="/"
                    className="mt-6 inline-block bg-navy-600 text-white px-6 py-2 rounded-lg hover:bg-navy-700"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />

      {/* Floating chatbot – appears on every page */}
      <ChatBot />
    </div>
  );
};

export default App;
