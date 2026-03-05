import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaEnvelope, FaIdBadge } from 'react-icons/fa';
import api from '../api/axios';

const Profile = () => {
    const { user, logout } = useAuth();
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        // If we have user in context, we can use it, or fetch fresh
        if (user) {
            setProfileData(user);
        }
    }, [user]);

    if (!profileData) return <div className="container page-content">Loading...</div>;

    return (
        <div className="container page-content">
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    margin: '0 auto 1.5rem',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '4px solid var(--primary)',
                    background: 'var(--surface-hover)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {profileData.profilePic ? (
                        <img
                            src={`http://localhost:5000/${profileData.profilePic.replace(/\\/g, '/').replace(/^public\//, '')}`}
                            alt="Profile"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <FaUserCircle size={80} color="var(--text-muted)" />
                    )}
                </div>

                <h2 style={{ marginBottom: '0.5rem' }}>{profileData.name}</h2>
                <span style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: 'var(--primary)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                }}>
                    {profileData.role}
                </span>

                <div style={{ marginTop: '2rem', textAlign: 'left' }}>
                    <div className="input-group">
                        <label>Email</label>
                        <div className="input-control" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--background)' }}>
                            <FaEnvelope color="var(--text-muted)" />
                            {profileData.email}
                        </div>
                    </div>
                    <div className="input-group">
                        <label>User ID</label>
                        <div className="input-control" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--background)' }}>
                            <FaIdBadge color="var(--text-muted)" />
                            {profileData._id}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
