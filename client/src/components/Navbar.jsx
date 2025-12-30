import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../utils/api';

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const checkUser = async () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Also fetch fresh data to sync profile picture
        try {
            if (localStorage.getItem('token')) {
                const res = await api.get('/auth/me');
                setUser(res.data);
                localStorage.setItem('user', JSON.stringify(res.data));
            }
        } catch (err) {
            console.error('Failed to sync user data in navbar', err);
        }
    };

    useEffect(() => {
        checkUser();

        // Listen for updates from Profile page
        window.addEventListener('userUpdated', checkUser);

        return () => {
            window.removeEventListener('userUpdated', checkUser);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('hasSeenTutorial');
        setUser(null);
        navigate('/login');
    };

    const playNavSound = () => {
        const audio = new Audio('/sounds/nav_jump.mp3');
        audio.volume = 0.6;
        audio.play().catch(e => console.error("Audio play failed", e));
    };

    return (
        <nav style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            zIndex: 1000,
            borderBottom: '4px solid black',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 40px',
            boxShadow: '0px 4px 0px rgba(0,0,0,1)',
            // BACKGROUND LAYERS
            background: `
                linear-gradient(to bottom, rgba(245, 243, 239, 0.95), rgba(245, 243, 239, 0.95)),
                url('/img/bg-image.png')
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'multiply'
        }}>
            {/* Logo Area */}
            <div className="logo" style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: '2rem',
                fontWeight: '800',
                letterSpacing: '-1px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'black',
                textTransform: 'uppercase'
            }}>
                <span>Hobby<span style={{ color: 'var(--accent)' }}>Hub</span></span>
            </div>

            {/* Navigation Links */}
            <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                <NavLink to="/about" onClick={playNavSound} style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.5px' }}>ABOUT</NavLink>
                <NavLink to="/explore" onClick={playNavSound} style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.5px' }}>POSTS</NavLink>

                {user ? (
                    <>
                        <NavLink to="/dashboard" onClick={playNavSound} style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.5px' }}>DASHBOARD</NavLink>
                        <NavLink to="/chat" onClick={playNavSound} style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.5px' }}>CHAT</NavLink>
                        <div style={{ position: 'relative', marginLeft: '20px' }}
                            onMouseEnter={() => setShowDropdown(true)}
                            onMouseLeave={() => setShowDropdown(false)}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                                padding: '5px 15px', border: '2px solid black', borderRadius: '30px', background: 'white'
                            }}>
                                <img
                                    src={user.profilePicture ? (user.profilePicture.startsWith('http') ? user.profilePicture : `${import.meta.env.VITE_API_URL}${user.profilePicture}`) : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.username}
                                    alt="Profile"
                                    style={{ width: '30px', height: '30px', borderRadius: '50%', border: '2px solid black' }}
                                />
                                <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{user.username}</span>
                            </div>

                            {showDropdown && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    width: '200px',
                                    paddingTop: '10px', // Invisible bridge to prevent closing
                                    zIndex: 1000
                                }}>
                                    <div style={{
                                        background: 'white',
                                        border: '3px solid black',
                                        boxShadow: '8px 8px 0px black',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <Link to="/profile" onClick={playNavSound} style={{ padding: '15px', fontWeight: 'bold', color: 'black', textDecoration: 'none', borderBottom: '2px solid black', hover: { background: '#f0f0f0' } }}>
                                            PROFILE
                                        </Link>
                                        <button onClick={() => { playNavSound(); handleLogout(); }} style={{ padding: '15px', fontWeight: 'bold', color: 'white', background: 'red', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'Space Grotesk' }}>
                                            LOGOUT
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" onClick={playNavSound} style={{ fontWeight: '700', textTransform: 'uppercase' }}>LOGIN</NavLink>
                        <Link to="/register" onClick={playNavSound} style={{ textDecoration: 'none' }}>
                            <button className="neo-btn" style={{ padding: '10px 25px', fontSize: '1rem' }}>
                                Get Started
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
