import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Attempt to fetch current user data if there's an endpoint, or just optimistically set user if we stored it.
                // For now, let's try to hit /users/me
                const response = await api.get('/users/me');
                setUser(response.data.data.user || response.data.data.data); // Adjust based on actual response structure for getMe
            } catch (error) {
                console.error("Session expired or invalid", error);
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/users/login', { email, password });
            const { token, data } = response.data;
            localStorage.setItem('token', token);
            setUser(data.user);
            toast.success('Login successful!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const signup = async (formData) => {
        try {
            // signup expects FormData because of file upload
            const response = await api.post('/users/signup', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success(response.data.message || 'Signup successful. Please verify OTP.');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Signup failed');
            return false;
        }
    };

    const verifyOtp = async (email, otp) => {
        try {
            const response = await api.post('/users/verify-otp', { email, otp: Number(otp) });
            const { token, data } = response.data;
            localStorage.setItem('token', token);
            setUser(data.user);
            toast.success('Email verified successfully!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'OTP verification failed');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        toast.success('Logged out');
        // iterate call to backend logout if needed, but client side clear is enough for JWT usually unless using cookies strictly
        try {
            api.post('/users/logout');
        } catch (err) {
            // ignore
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, verifyOtp, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
