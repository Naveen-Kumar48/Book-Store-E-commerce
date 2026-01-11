import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FaBook, FaAlignLeft, FaDollarSign, FaTags, FaLayerGroup, FaBoxOpen } from 'react-icons/fa';

const AddBook = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        discount: '',
        genre: 'fantasy',
        stock: '',
        authorNames: '' // Comma separated
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Transform authorNames to array
        const payload = {
            ...formData,
            authorNames: formData.authorNames.split(',').map(name => name.trim()).filter(n => n),
            price: Number(formData.price),
            discount: Number(formData.discount),
            stock: Number(formData.stock)
        };

        try {
            await api.post('/books', payload);
            toast.success('Book created successfully!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create book');
        } finally {
            setLoading(false);
        }
    };

    const genres = [
        "fantasy", "science_fiction", "mystery", "romance", "horror",
        "historical_fiction", "self_help", "biography"
    ];

    return (
        <div className="container page-content">
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '2rem' }}>Add New <span className="gradient-text">Book</span></h2>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Title</label>
                        <div style={{ position: 'relative' }}>
                            <FaBook style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                name="title"
                                className="input-control"
                                style={{ paddingLeft: '2.5rem' }}
                                placeholder="Book Title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Description</label>
                        <div style={{ position: 'relative' }}>
                            <FaAlignLeft style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-muted)' }} />
                            <textarea
                                name="description"
                                className="input-control"
                                style={{ paddingLeft: '2.5rem', minHeight: '120px', resize: 'vertical' }}
                                placeholder="Book Description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="input-group">
                            <label>Price</label>
                            <div style={{ position: 'relative' }}>
                                <FaDollarSign style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="number"
                                    name="price"
                                    className="input-control"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="29.99"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Discount</label>
                            <div style={{ position: 'relative' }}>
                                <FaDollarSign style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="number"
                                    name="discount"
                                    className="input-control"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="5.00"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="input-group">
                            <label>Genre</label>
                            <div style={{ position: 'relative' }}>
                                <FaLayerGroup style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <select
                                    name="genre"
                                    className="input-control"
                                    style={{ paddingLeft: '2.5rem', appearance: 'none' }}
                                    value={formData.genre}
                                    onChange={handleChange}
                                >
                                    {genres.map(g => (
                                        <option key={g} value={g}>{g.replace('_', ' ').toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Stock</label>
                            <div style={{ position: 'relative' }}>
                                <FaBoxOpen style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="number"
                                    name="stock"
                                    className="input-control"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="100"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Author(s) (Comma separated)</label>
                        <div style={{ position: 'relative' }}>
                            <FaTags style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                name="authorNames"
                                className="input-control"
                                style={{ paddingLeft: '2.5rem' }}
                                placeholder="J.K. Rowling, Stephen King"
                                value={formData.authorNames}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Book'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddBook;
