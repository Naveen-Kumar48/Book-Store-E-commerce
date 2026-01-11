import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { FaBookOpen, FaShoppingCart, FaArrowLeft, FaTags } from 'react-icons/fa';

const getRandomGradient = (id) => {
    const gradients = [
        'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
        'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
        'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    ];
    return gradients[id ? id.charCodeAt(0) % gradients.length : 0];
};

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await api.get(`/books/${id}`);
                setBook(response.data.data.book);
            } catch (error) {
                console.error("Failed to fetch book details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    if (loading) return <div className="container page-content">Loading...</div>;
    if (!book) return <div className="container page-content">Book not found</div>;

    return (
        <div className="container page-content">
            <Link to="/" className="btn btn-secondary" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaArrowLeft /> Back to Store
            </Link>

            <div className="card" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '3rem', alignItems: 'start', padding: '2rem' }}>
                <div style={{
                    height: '400px',
                    borderRadius: '12px',
                    background: getRandomGradient(book._id),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(0,0,0,0.2)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}>
                    <FaBookOpen size={120} />
                </div>

                <div>
                    <div style={{ marginBottom: '1rem' }}>
                        <span style={{
                            background: 'var(--primary)',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            letterSpacing: '0.05em'
                        }}>
                            {book.genre ? book.genre.replace('_', ' ') : 'Uncategorized'}
                        </span>
                    </div>

                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', lineHeight: '1.2' }}>{book.title}</h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        By {book.authorNames?.join(', ') || 'Unknown Author'}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '2rem' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>${book.price}</span>
                        {book.discount > 0 && (
                            <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                                ${(book.price + book.discount).toFixed(2)}
                                {/* Assuming discount is amount off, or re-calculate based on logic. 
                                    Looking at Home.jsx, discount seemed to be just a number displayed next to price, 
                                    maybe price IS the final price. I'll stick to displaying current price. */}
                            </span>
                        )}
                    </div>

                    <p style={{ lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.05rem' }}>
                        {book.description}
                    </p>

                    <div style={{ padding: '1.5rem', background: 'var(--surface-hover)', borderRadius: '12px', display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Stock</span>
                            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{book.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                        </div>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Published</span>
                            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{book.publishedData ? new Date(book.publishedData).getFullYear() : 'N/A'}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => addToCart(book)}
                        className="btn btn-primary"
                        style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
                        disabled={book.stock <= 0}
                    >
                        <FaShoppingCart /> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
