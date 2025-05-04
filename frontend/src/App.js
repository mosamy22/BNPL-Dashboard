import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import MerchantDashboard from './components/MerchantDashboard';
import UserDashboard from './components/UserDashboard';
import Header from './components/Header';
import './styles/index.css';

const ProtectedRoute = ({ children, requireMerchant = false }) => {
    const { isAuthenticated, isMerchant, isLoading } = useAuth();
    
    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>;
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    
    if (requireMerchant && !isMerchant) {
        return <Navigate to="/dashboard" />;
    }
    
    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
                path="/merchant-dashboard" 
                element={
                    <ProtectedRoute requireMerchant>
                        <MerchantDashboard />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <UserDashboard />
                    </ProtectedRoute>
                } 
            />
            <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
    );
};

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-gray-100">
                    <Header />
                    <main className="container mx-auto px-4 py-8">
                        <AppRoutes />
                    </main>
                </div>
            </AuthProvider>
        </Router>
    );
};

export default App;