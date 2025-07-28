import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth, User } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import { Login } from "./pages/Login";
import GameSelection from "./pages/GameSelection";
import GameDashboard from "./pages/GameDashboard";
import CharacterCreation from "./pages/CharacterCreation";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();


function AppContent() {
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route 
          path="/login" 
          element={
            user ? 
            <Navigate to="/game-selection" /> : 
            <Login />
          } 
        />
        <Route 
          path="/game-selection" 
          element={
            <ProtectedRoute>
              <GameSelection user={user!} onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/game/:gameId" 
          element={
            <ProtectedRoute>
              <GameDashboard user={user!} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/character-creation" 
          element={
            <ProtectedRoute requireRole="player">
              <CharacterCreation user={user!} />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

