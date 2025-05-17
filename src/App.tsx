
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { JournalProvider } from "@/contexts/JournalContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard";
import Tasks from "./pages/dashboard/Tasks";
import Journal from "./pages/dashboard/Journal";
import Planning from "./pages/dashboard/Planning";
import AIAssistant from "./pages/dashboard/AIAssistant";
import Stats from "./pages/dashboard/Stats";
import Settings from "./pages/dashboard/Settings";
import Profile from "./pages/dashboard/Profile";
import Help from "./pages/dashboard/Help";
import DashboardNotFound from "./pages/dashboard/NotFound";

// Main 404 Page
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TaskProvider>
        <JournalProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/tasks" element={
                  <ProtectedRoute>
                    <Tasks />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/journal" element={
                  <ProtectedRoute>
                    <Journal />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/planning" element={
                  <ProtectedRoute>
                    <Planning />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/ai" element={
                  <ProtectedRoute>
                    <AIAssistant />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/stats" element={
                  <ProtectedRoute>
                    <Stats />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/help" element={
                  <ProtectedRoute>
                    <Help />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/*" element={
                  <ProtectedRoute>
                    <DashboardNotFound />
                  </ProtectedRoute>
                } />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </JournalProvider>
      </TaskProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
