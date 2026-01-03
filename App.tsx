
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { HashRouter, Routes, Route, Navigate, useLocation } = ReactRouterDOM as any;
const Router = HashRouter;

import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Wallet } from './pages/Wallet';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Admin } from './pages/Admin';
import { Profile } from './pages/Profile';
import { HelpCenter } from './pages/HelpCenter';
import { CourseDetail } from './pages/CourseDetail';
import { Certificates } from './pages/Certificates';
import { Leaderboard } from './pages/Leaderboard';
import { Flashcards } from './pages/Flashcards';
import { VideoAI } from './pages/VideoAI';
import { Community } from './pages/Community';
import { ExamHub } from './components/ExamHub';
import { OnboardingTour } from './components/OnboardingTour';
import { NursyGuideBot } from './components/NursyGuideBot';
import { jwtUtils } from './utils/jwt';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, isLoading } = useApp();
  const location = useLocation();

  if (isLoading) return null; 

  const isAuthenticated = user && token && !jwtUtils.isExpired(token);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user } = useApp();
  return (
    <Layout>
       <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/course/:courseId" element={<CourseDetail />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/ai-vision" element={<VideoAI />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/community" 
            element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/wallet" 
            element={
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/certificates" 
            element={
              <ProtectedRoute>
                <Certificates />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leaderboard" 
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/flashcards" 
            element={
              <ProtectedRoute>
                <Flashcards />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
       </Routes>
       
       {user && (
         <>
           <ExamHub />
           <OnboardingTour />
           <NursyGuideBot />
         </>
       )}
    </Layout>
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
