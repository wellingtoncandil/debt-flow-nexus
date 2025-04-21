
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import RouteGuard from "@/components/auth/RouteGuard";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Portfolios from "./pages/Portfolios";
import PortfolioDetail from "./pages/PortfolioDetail";
import Opportunities from "./pages/Opportunities";
import Contracts from "./pages/Contracts";
import Payments from "./pages/Payments";
import Agencies from "./pages/Agencies";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes - wrapped in MainLayout */}
            <Route element={<MainLayout />}>
              <Route 
                path="/dashboard" 
                element={
                  <RouteGuard>
                    <Dashboard />
                  </RouteGuard>
                } 
              />
              
              {/* Institution routes */}
              <Route 
                path="/portfolios" 
                element={
                  <RouteGuard allowedRoles={['institution']}>
                    <Portfolios />
                  </RouteGuard>
                } 
              />
              <Route 
                path="/portfolios/:id" 
                element={
                  <RouteGuard allowedRoles={['institution']}>
                    <PortfolioDetail />
                  </RouteGuard>
                } 
              />
              <Route 
                path="/agencies" 
                element={
                  <RouteGuard allowedRoles={['institution']}>
                    <Agencies />
                  </RouteGuard>
                } 
              />
              
              {/* Agency routes */}
              <Route 
                path="/opportunities" 
                element={
                  <RouteGuard allowedRoles={['agency']}>
                    <Opportunities />
                  </RouteGuard>
                } 
              />
              
              {/* Common routes */}
              <Route 
                path="/contracts" 
                element={
                  <RouteGuard>
                    <Contracts />
                  </RouteGuard>
                } 
              />
              <Route 
                path="/payments" 
                element={
                  <RouteGuard>
                    <Payments />
                  </RouteGuard>
                } 
              />
            </Route>
            
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/login" />} />
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
