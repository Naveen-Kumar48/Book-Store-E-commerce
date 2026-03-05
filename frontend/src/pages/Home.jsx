import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaPlus, FaBookOpen, FaShoppingCart, FaSearch, FaFilter } from 'react-icons/fa';

/**
 * Helper to get a random gradient for book covers if no image is available
 */
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

const Home = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const { user } = useAuth();
    const { addToCart } = useCart();

    // Check if user is Author or Admin to show Add button
    const canAddBook = user && (user.role === 'author' || user.role === 'admin');

    const genres = [
        "all", "fantasy", "science_fiction", "mystery", "romance", "horror",
        "historical_fiction", "self_help", "biography"
    ];

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        let result = books;

        // Filter by Genre
        if (selectedGenre !== 'all') {
            result = result.filter(book => book.genre === selectedGenre);
        }

        // Filter by Search
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(book =>
                book.title.toLowerCase().includes(lowerQuery) ||
                book.authorNames?.some(name => name.toLowerCase().includes(lowerQuery))
            );
        }

        setFilteredBooks(result);
    }, [books, selectedGenre, searchQuery]);

    const fetchBooks = async () => {
        try {
            const response = await api.get('/books');
            const results = response.data.data.books || response.data.data;
            const booksArray = Array.isArray(results) ? results : [];
            setBooks(booksArray);
            setFilteredBooks(booksArray);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container page-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>Explore <span className="gradient-text">Books</span></h1>
                    <p style={{ color: 'var(--text-muted)' }}>Discover your next favorite read.</p>
                </div>
                {canAddBook && (
                    <Link to="/add-book" className="btn btn-primary">
                        <FaPlus /> Add Book
                    </Link>
                )}
            </div>

            <div className="grid-sidebar-layout">
                {/* Sidebar Filters */}
                <div style={{ alignSelf: 'start' }}>
                    <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
                        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                            <div style={{ position: 'relative' }}>
                                <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    className="input-control"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="Search details..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaFilter size={14} color="var(--primary)" /> Categories
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {genres.map(genre => (
                                <button
                                    key={genre}
                                    onClick={() => setSelectedGenre(genre)}
                                    style={{
                                        textAlign: 'left',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        background: selectedGenre === genre ? 'var(--primary)' : 'transparent',
                                        color: selectedGenre === genre ? 'white' : 'var(--text-muted)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: selectedGenre === genre ? '600' : '400',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {genre.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                            Loading books...
                        </div>
                    ) : filteredBooks.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                            <FaBookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                            <h3>No books found.</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
                            {filteredBooks.map(book => (
                                <div key={book._id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s' }}>
                                    <Link to={`/book/${book._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {book.bookImage ? (
                                            <div style={{
                                                height: '200px',
                                                backgroundImage: `url(${book.bookImage})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}></div>
                                        ) : (
                                            <div style={{
                                                height: '200px',
                                                background: getRandomGradient(book._id),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'rgba(0,0,0,0.3)'
                                            }}>
                                                <FaBookOpen size={64} />
                                            </div>
                                        )}
                                    </Link>

                                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px',
                                                color: 'var(--text-muted)',
                                                fontWeight: '600'
                                            }}>
                                                {book.genre ? book.genre.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Uncategorized'}
                                            </span>
                                        </div>

                                        <Link to={`/book/${book._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>{book.title}</h3>
                                        </Link>

                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', flex: 1 }}>
                                            by {book.authorNames?.[0] || 'Unknown'}
                                        </p>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                ${book.price}
                                            </span>
                                            <button
                                                onClick={() => addToCart(book)}
                                                className="btn btn-primary"
                                                style={{ padding: '0.5rem', borderRadius: '50%', width: '35px', height: '35px' }}
                                                title="Add to Cart"
                                            >
                                                <FaShoppingCart size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
