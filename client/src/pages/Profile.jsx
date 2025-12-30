import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { User, Mail, Users, Camera, Edit2, Save, X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ username: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);
    const containerRef = useRef();
    const avatarRef = useRef();

    const fetchProfile = async () => {
        try {
            const res = await api.get('/auth/me');
            setProfile(res.data);
            setFormData({ username: res.data.username });
            setLoading(false);
        } catch (err) {
            setError('Failed to load profile');
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    useGSAP(() => {
        if (!loading && profile) {
            const tl = gsap.timeline();
            tl.from(containerRef.current, { y: 20, opacity: 0, duration: 0.5 })
                .from(avatarRef.current, { scale: 0, rotation: -45, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.3')
                .from('.profile-field', { x: -20, opacity: 0, duration: 0.4, stagger: 0.1 }, '-=0.2');
        }
    }, [loading]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        const data = new FormData();
        data.append('username', formData.username);
        if (selectedFile) {
            data.append('profilePicture', selectedFile);
        }

        try {
            const res = await api.put('/users/profile', data);
            setProfile(res.data);

            // Update localStorage and trigger event for Navbar
            localStorage.setItem('user', JSON.stringify(res.data));
            window.dispatchEvent(new Event('userUpdated'));

            setIsEditing(false);
            setPreviewUrl(null);
            setSelectedFile(null);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Failed to update profile');
        }
    };

    if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading...</div>;
    if (error) return <div style={{ paddingTop: '100px', textAlign: 'center', color: 'var(--error)' }}>{error}</div>;

    const profilePicUrl = previewUrl || (profile.profilePicture ? (profile.profilePicture.startsWith('http') ? profile.profilePicture : `${import.meta.env.VITE_API_URL}${profile.profilePicture}`) : null);

    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '50px' }}>
            <div ref={containerRef} className="neo-card" style={{ maxWidth: '700px', margin: '0 auto', padding: '40px', position: 'relative', border: '3px solid black', boxShadow: '12px 12px 0px 0px black' }}>

                {/* ID Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '3px solid black', paddingBottom: '20px' }}>
                    <h1 style={{ fontSize: '3rem', margin: 0, lineHeight: 0.8 }}>IDENTIFICATION<br /><span style={{ color: 'var(--accent)', fontSize: '1.5rem', letterSpacing: '2px' }}>// USER PROFILE</span></h1>
                    <div style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 'bold' }}>
                        ID: {profile._id.substring(0, 8).toUpperCase()}<br />
                        STATUS: ACTIVE
                    </div>
                </div>

                <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                    {/* Edit buttons handles logic same as before but styled brutalist */}
                    {isEditing ? (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => { setIsEditing(false); setPreviewUrl(null); setSelectedFile(null); }} className="neo-btn neo-btn-secondary" style={{ padding: '8px', border: '2px solid black' }} title="Cancel">
                                <X size={24} />
                            </button>
                            <button onClick={handleSubmit} className="neo-btn" style={{ padding: '8px', border: '2px solid black' }} title="Save">
                                <Save size={24} />
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="neo-btn" style={{ padding: '8px', border: '2px solid black', position: 'absolute', top: 0, right: 0 }} title="Edit Profile">
                            <Edit2 size={24} />
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '40px', flexDirection: 'column' }}> {/* Mobile friendly column */}
                    <div style={{ textAlign: 'center' }}>
                        <div ref={avatarRef} style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 20px', border: '3px solid black', padding: '5px' }}>
                            <div style={{
                                width: '100%',
                                height: '100%',
                                background: 'var(--bg-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '4rem',
                                fontWeight: '800',
                                color: 'black',
                                overflow: 'hidden',
                            }}>
                                {profilePicUrl ? (
                                    <img src={profilePicUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} />
                                ) : (
                                    profile.username && profile.username.charAt(0).toUpperCase()
                                )}
                            </div>
                            {isEditing && (
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="neo-btn"
                                    style={{
                                        position: 'absolute',
                                        bottom: '-10px',
                                        right: '-10px',
                                        width: '50px',
                                        height: '50px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        padding: 0
                                    }}
                                >
                                    <Camera size={24} />
                                </button>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                        </div>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ background: 'var(--bg-secondary)', border: '2px solid black', padding: '15px' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '5px', textTransform: 'uppercase' }}>Username</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="neo-input"
                                    style={{ fontSize: '1.5rem', fontWeight: 'bold', padding: '5px' }}
                                />
                            ) : (
                                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{profile.username}</div>
                            )}
                        </div>

                        <div style={{ background: 'var(--bg-secondary)', border: '2px solid black', padding: '15px' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '5px', textTransform: 'uppercase' }}>Email</label>
                            <div style={{ fontSize: '1.2rem', fontFamily: 'monospace' }}>{profile.email}</div>
                        </div>

                        <div style={{ background: 'var(--bg-secondary)', border: '2px solid black', padding: '15px' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px', textTransform: 'uppercase' }}>Member Of</label>
                            {profile.joinedGroups && profile.joinedGroups.length > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {profile.joinedGroups.map(group => (
                                        <span key={group._id} style={{
                                            padding: '8px 16px',
                                            background: 'black',
                                            color: 'var(--accent-lime)',
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem',
                                            textTransform: 'uppercase',
                                            boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.2)'
                                        }}>
                                            {group.name}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ fontStyle: 'italic', fontWeight: '500' }}>NO AFFILIATIONS.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
