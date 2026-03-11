import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { FaBox, FaCheckCircle, FaClock, FaTruck } from 'react-icons/fa';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { clearCart } = useCart();
    const location = useLocation();

    useEffect(() => {
        // Read URL params for stripe checkout result
        const params = new URLSearchParams(location.search);
        if (params.get('payment') === 'success') {
            toast.success("Payment successful! Your order has been placed.");
            clearCart();
            // Remove the param from the URL so it doesn't show up again
            window.history.replaceState(null, '','/orders');
        }
        if (params.get('payment') === 'cancelled') {
            toast.error("Checkout was cancelled.");
            window.history.replaceState(null, '', '/orders');
        }

        fetchOrders();
    }, [location.search]);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders/my-orders');
            setOrders(response.data.data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error("Failed to load your orders");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="container page-content" style={{ textAlign: 'center', padding: '4rem' }}>Loading Orders...</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="container page-content" style={{ textAlign: 'center', padding: '4rem' }}>
                <FaBox size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <h2>No Orders Yet</h2>
                <p style={{ color: 'var(--text-muted)' }}>When you buy books, your history will appear here.</p>
            </div>
        );
    }

    return (
        <div className="container page-content">
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>My <span className="gradient-text">Orders</span></h1>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {orders.map(order => (
                    <div key={order._id} className="card" style={{ padding: '1.5rem' }}>
                        <div className="grid-orders-layout" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Order #{order._id.substring(order._id.length - 6).toUpperCase()}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '50px',
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                    backgroundColor: order.status === 'delivered' ? 'rgba(34, 197, 94, 0.1)' : order.status === 'placed' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                                    color: order.status === 'delivered' ? 'var(--success)' : order.status === 'placed' ? '#3b82f6' : 'var(--warning)'
                                }}>
                                    {order.status === 'delivered' ? <FaCheckCircle /> : order.status === 'placed' ? <FaTruck /> : <FaClock />}
                                    <span style={{ textTransform: 'capitalize' }}>{order.status}</span>
                                </div>
                                <h3 style={{ marginTop: '0.5rem', fontSize: '1.2rem' }}>${order.totalAmount.toFixed(2)}</h3>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {order.books.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{item.quantity}x {item.title}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        {order.status === 'placed' && (
                            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--surface-hover)', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaClock style={{ color: 'var(--primary)' }} />
                                <span>This order was placed successfully and will be marked as <strong>delivered in 8 hours</strong> automatically.</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
