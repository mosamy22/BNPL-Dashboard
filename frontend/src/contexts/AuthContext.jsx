import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlans } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isMerchant, setIsMerchant] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('token');
            const merchantStatus = localStorage.getItem('isMerchant') === 'true';
            
            if (token) {
                try {
                    // Try to make an authenticated request to validate the token
                    await getPlans();
                    setIsAuthenticated(true);
                    setIsMerchant(merchantStatus);
                } catch (error) {
                    // If the request fails, clear the invalid token
                    localStorage.removeItem('token');
                    localStorage.removeItem('isMerchant');
                    setIsAuthenticated(false);
                    setIsMerchant(false);
                    navigate('/login');
                }
            } else {
                setIsAuthenticated(false);
                setIsMerchant(false);
            }
            setIsLoading(false);
        };

        validateToken();
    }, [navigate]);

    const login = (token, isMerchantStatus) => {
        localStorage.setItem('token', token);
        localStorage.setItem('isMerchant', isMerchantStatus);
        setIsAuthenticated(true);
        setIsMerchant(isMerchantStatus);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isMerchant');
        setIsAuthenticated(false);
        setIsMerchant(false);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isMerchant, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 