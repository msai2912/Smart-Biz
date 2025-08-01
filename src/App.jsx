import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import EnhancedWebsiteBuilderPage from "./pages/EnhancedWebsiteBuilderPage";
import EmailPage from "./pages/EmailPage";
import BusinessCardPage from "./pages/BusinessCardPage";
import ProfilePage from "./pages/ProfilePage";
import ContentGenerationPage from "./pages/ContentGenerationPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Navbar />
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/website-builder" element={
            <ProtectedRoute>
              <Navbar />
              <EnhancedWebsiteBuilderPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/email" element={
            <ProtectedRoute>
              <Navbar />
              <EmailPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/business-cards" element={
            <ProtectedRoute>
              <Navbar />
              <BusinessCardPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/content-generation" element={
            <ProtectedRoute>
              <Navbar />
              <ContentGenerationPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/profile" element={
            <ProtectedRoute>
              <Navbar />
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
