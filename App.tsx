
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { HashRouter, Routes, Route, Navigate, useLocation } = ReactRouterDOM as any;
const Router = HashRouter;

import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { MobileNav } from './components/MobileNav';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Admin } from './pages/Admin';
import { Profile } from './pages/Profile';
import { CourseDetail } from './pages/CourseDetail';
import { Community } from './pages/Community';
import { Schedule } from './pages/Schedule';
import { NotFound } from './pages/NotFound';
import { Wallet } from './pages/Wallet';
import { Flashcards } from './pages/Flashcards';
import { UploadResource } from './pages/UploadResource';
import { Certificates } from './pages/Certificates';
import { Leaderboard } from './pages/Leaderboard';
import { HelpCenter } from './pages/HelpCenter';
import { MyCourses } from './pages/MyCourses';
import { Tables } from './pages/Tables';
import { jwtUtils } from './utils/jwt';

// Public Route: Redirects to dashboard if user is ALREADY logged in
// This ensures the login page disappears for registered/active users
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useApp();
  
  if (isLoading) {
     return null; // Or a minimal loader
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, isLoading } = useApp();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] dark:bg-[#101010]">
         <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38020]"></div>
            <p className="text-sm text-gray-500 animate-pulse">جاري التحميل...</p>
         </div>
      </div>
    );
  }

  const isAuthenticated = user && token && !jwtUtils.isExpired(token);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      {children}
      <MobileNav /> {/* Show Mobile Nav on protected routes */}
    </>
  );
};

// Admin Route Component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useApp();
  const OWNERS = ["toji123oodo@gmail.com", "Mstfymdht542@gmail.com"];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] dark:bg-[#101010]">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38020]"></div>
      </div>
    );
  }

  if (!user || (!OWNERS.includes(user.email) && user.role !== 'admin')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <Routes>
       <Route path="/" element={<Landing />} />
       
       {/* Public Routes (Login/Signup) are now guarded by PublicRoute */}
       {/* This means if a user is logged in (including auto-login), they cannot access these pages */}
       <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
       <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
       
       {/* Dashboard Layout Routes */}
       <Route path="/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
       <Route path="/dashboard/courses" element={<Layout><ProtectedRoute><MyCourses /></ProtectedRoute></Layout>} /> 
       <Route path="/tables" element={<Layout><ProtectedRoute><Tables /></ProtectedRoute></Layout>} />
       
       <Route path="/course/:courseId" element={<Layout><ProtectedRoute><CourseDetail /></ProtectedRoute></Layout>} />
       <Route path="/community" element={<Layout><ProtectedRoute><Community /></ProtectedRoute></Layout>} />
       <Route path="/schedule" element={<Layout><ProtectedRoute><Schedule /></ProtectedRoute></Layout>} />
       <Route path="/profile" element={<Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>} />
       <Route path="/wallet" element={<Layout><ProtectedRoute><Wallet /></ProtectedRoute></Layout>} />
       <Route path="/flashcards" element={<Layout><ProtectedRoute><Flashcards /></ProtectedRoute></Layout>} />
       <Route path="/uploads" element={<Layout><ProtectedRoute><UploadResource /></ProtectedRoute></Layout>} />
       <Route path="/certificates" element={<Layout><ProtectedRoute><Certificates /></ProtectedRoute></Layout>} />
       <Route path="/leaderboard" element={<Layout><ProtectedRoute><Leaderboard /></ProtectedRoute></Layout>} />
       <Route path="/help" element={<Layout><ProtectedRoute><HelpCenter /></ProtectedRoute></Layout>} />
       
       {/* Protected Admin Route */}
       <Route path="/admin" element={<Layout><AdminRoute><Admin /></AdminRoute></Layout>} />
       
       <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;
