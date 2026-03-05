import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaTrash, FaMinus, FaPlus, FaCreditCard } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = async () => {
        if (!user) {
            toast.error("Please login to checkout");
            navigate('/login');
            return;
        }
        setIsCheckingOut(true);
        try {
            const payload = {
                items: cart.map(item => ({
                    bookId: item._id,
                    quantity: item.quantity
                }))
            };
            const response = await api.post('/orders/checkout-session', payload);
            if (response.data && response.data.session && response.data.session.url) {
                // Redirect to Stripe checkout page
                window.location.href = response.data.session.url;
            } else {
                toast.error("Failed to initialize checkout.");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Checkout failed");
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container page-content" style={{ textAlign: 'center', padding: '4rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Your Cart is Empty</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Looks like you haven't added any books yet.</p>
                <Link to="/" className="btn btn-primary">Browse Books</Link>
            </div>
        );
    }

    return (
        <div className="container page-content">
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Shopping <span className="gradient-text">Cart</span></h1>

            <div className="grid-cart-layout">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cart.map(item => (
                        <div key={item._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem' }}>
                            <div style={{
                                width: '80px',
                                height: '100px',
                                background: 'var(--surface-hover)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem'
                            }}>
                                📖
                            </div>

                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>By {item.authorNames?.join(', ') || 'Unknown Author'}</p>
                                <div style={{ marginTop: '0.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                                    ${item.price}
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--surface-hover)', padding: '0.25rem 0.5rem', borderRadius: '8px' }}>
                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                    className="btn btn-icon"
                                    disabled={item.quantity <= 1}
                                    style={{ padding: '0.25rem' }}
                                >
                                    <FaMinus size={12} />
                                </button>
                                <span style={{ fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                    className="btn btn-icon"
                                    style={{ padding: '0.25rem' }}
                                >
                                    <FaPlus size={12} />
                                </button>
                            </div>

                            <button
                                onClick={() => removeFromCart(item._id)}
                                className="btn btn-secondary"
                                style={{ color: 'var(--error)', borderColor: 'var(--error)', background: 'transparent' }}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="card" style={{ position: 'sticky', top: '100px' }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Order Summary</h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                        <span style={{ color: 'var(--success)' }}>Free</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '2rem' }}
                        disabled={isCheckingOut}
                    >
                        {isCheckingOut ? 'Processing...' : (
                            <>
                                <FaCreditCard /> Checkout
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
