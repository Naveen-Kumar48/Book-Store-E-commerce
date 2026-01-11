import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AddBook from './pages/AddBook';

import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';
import BookDetails from './pages/BookDetails';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Public Route (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (!loading && user) {
    return <Navigate to="/" />;
  }
  return children;
};

const AppContent = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/add-book" element={<ProtectedRoute><AddBook /></ProtectedRoute>} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#334155',
            color: '#fff',
          }
        }}
      />
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
