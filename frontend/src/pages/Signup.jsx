import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaImage, FaKey } from 'react-icons/fa';

const Signup = () => {
    const [step, setStep] = useState(1); // 1: Details, 2: OTP
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        profilePic: null
    });
    const [otp, setOtp] = useState('');
    const { signup, verifyOtp } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, profilePic: e.target.files[0] });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('confirmPassword', formData.confirmPassword);
        if (formData.profilePic) {
            data.append('profilePic', formData.profilePic);
        }
        // Default role
        data.append('role', 'user');

        const success = await signup(data);
        if (success) {
            setStep(2);
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await verifyOtp(formData.email, otp);
        if (success) {
            navigate('/');
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="card auth-card animate-fade-in">
                <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem', textAlign: 'center' }}>
                    Create <span className="gradient-text">Account</span>
                </h2>

                {step === 1 ? (
                    <form onSubmit={handleSignup}>
                        <div className="input-group">
                            <label>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <FaUser style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    name="name"
                                    className="input-control"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    minLength={5}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <FaEnvelope style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="email"
                                    name="email"
                                    className="input-control"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Profile Picture</label>
                            <div style={{ position: 'relative' }}>
                                <FaImage style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="file"
                                    className="input-control"
                                    style={{ paddingLeft: '2.5rem', paddingTop: '0.6rem' }}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    name="password"
                                    className="input-control"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={8}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="input-control"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                            {loading ? 'Signing up...' : 'Sign Up'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="animate-fade-in">
                        <div className="input-group">
                            <label>Enter OTP Sent to your Email</label>
                            <div style={{ position: 'relative' }}>
                                <FaKey style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    className="input-control"
                                    style={{ paddingLeft: '2.5rem', letterSpacing: '0.5rem', fontSize: '1.2rem' }}
                                    placeholder="------"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                        <button type="button" className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }} onClick={() => setStep(1)}>
                            Back
                        </button>
                    </form>
                )}

                {step === 1 && (
                    <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Login</Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Signup;
