import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBook, FaUser, FaSignOutAlt, FaShoppingCart, FaBox } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    // const [isOpen, setIsOpen] = useState(false); // Removed as per instruction snippet

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <span className="gradient-text">Book Store</span>
                </Link>

                {/* Desktop Menu */}
                <div className="navbar-menu hidden-mobile">
                    <Link to="/cart" className="btn btn-secondary btn-cart">
                        <FaShoppingCart size={20} />
                        {cartCount > 0 && (
                            <span className="cart-badge">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <>
                            <Link to="/" className="btn btn-secondary">
                                <FaBook /> Books
                            </Link>
                            <Link to="/orders" className="btn btn-secondary">
                                <FaBox /> Orders
                            </Link>
                            <Link to="/profile" className="user-profile-link">
                                <div className="user-avatar">
                                    {user.profilePic ? (
                                        <img src={`http://localhost:5000/${user.profilePic.replace(/\\/g, '/').replace(/^public\//, '')}`} alt="Profile" />
                                    ) : (
                                        <FaUser />
                                    )}
                                </div>
                                {user.name.split(' ')[0]}
                            </Link>
                            <button onClick={handleLogout} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                <FaSignOutAlt /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-secondary">Login</Link>
                            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
