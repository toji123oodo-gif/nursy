
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
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useApp();
  if (isLoading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, isLoading } = useApp();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] dark:bg-[#101010]">
         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F38020]"></div>
         <p className="mt-4 text-sm text-gray-500 animate-pulse font-bold">جاري التأكد من الحساب...</p>
         <button 
           onClick={() => window.location.reload()} 
           className="mt-8 text-xs text-[#F38020] underline"
         >
           إذا طال التحميل، اضغط هنا للتحديث
         </button>
      </div>
    );
  }

  // Check if authenticated (user exists)
  // If token exists but expired, we still let user in if Firebase session is active, 
  // but usually we want both.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      {children}
      <MobileNav />
    </>
  );
};

// Admin Route Component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useApp();
  const OWNERS = ["toji123oodo@gmail.com", "Mstfymdht542@gmail.com"];

  if (isLoading) return null;

  if (!user || (!OWNERS.includes(user.email) && user.role !== 'admin')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <Routes>
       <Route path="/" element={<Landing />} />
       <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
       <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
       
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
