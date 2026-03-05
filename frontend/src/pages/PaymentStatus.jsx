import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaShoppingBag } from 'react-icons/fa';

const PaymentStatus = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        // Check URL parameters for payment status
        if (searchParams.get('payment') === 'success') {
            setStatus('success');
        } else if (searchParams.get('payment') === 'cancelled') {
            setStatus('cancelled');
        } else {
            setStatus('unknown');
        }
    }, [searchParams]);

    if (status === 'loading') {
        return (
            <div className="container page-content" style={{ textAlign: 'center', padding: '4rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                <h2 style={{ marginBottom: '1rem' }}>Processing Payment...</h2>
                <p style={{ color: 'var(--text-muted)' }}>Please wait while we confirm your payment.</p>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="container page-content" style={{ textAlign: 'center', padding: '4rem' }}>
                <div style={{ 
                    fontSize: '5rem', 
                    color: 'var(--success)', 
                    marginBottom: '1.5rem',
                    animation: 'bounceIn 0.6s ease-out'
                }}>
                    <FaCheckCircle />
                </div>
                <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>Payment Successful!</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                    Thank you for your purchase. Your order has been placed successfully.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/" className="btn btn-primary">
                        <FaShoppingBag /> Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (status === 'cancelled') {
        return (
            <div className="container page-content" style={{ textAlign: 'center', padding: '4rem' }}>
                <div style={{ 
                    fontSize: '5rem', 
                    color: 'var(--error)', 
                    marginBottom: '1.5rem'
                }}>
                    <FaTimesCircle />
                </div>
                <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>Payment Cancelled</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                    Your payment was cancelled. No charges were made.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/cart" className="btn btn-primary">
                        Return to Cart
                    </Link>
                    <Link to="/" className="btn btn-secondary">
                        Browse Books
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container page-content" style={{ textAlign: 'center', padding: '4rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Invalid Payment Status</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Please check your orders or try again.
            </p>
            <Link to="/" className="btn btn-primary">Browse Books</Link>
        </div>
    );
};

export default PaymentStatus;
