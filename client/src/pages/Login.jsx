import { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import IntroAnimation from '../components/IntroAnimation';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '', role: 'user' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { email, password, role } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const playTypingSound = () => {
        const audio = new Audio('/sounds/typing.mp3');
        audio.volume = 0.5;
        audio.currentTime = 0;
        audio.play().catch(() => { });
    };

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });

            if (res.data.user.role !== role) {
                setError(`Access denied. You are not authorized as ${role}`);
                return;
            }

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            window.location.href = '/dashboard'; // Force reload to update navbar state or use context
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
        }
    };

    const playButtonPress = () => {
        const audio = new Audio('/sounds/button_press.mp3');
        audio.play().catch(() => { });
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '60px', position: 'relative', overflow: 'hidden' }}>

            {/* Intro Animation Removed - Moved to Post-Login Splash */}

            <div className="neo-card" style={{
                padding: '40px',
                width: '90%',
                maxWidth: '450px',
                border: '3px solid black',
                boxShadow: '10px 10px 0px 0px black',
                background: 'rgba(255, 255, 255, 0.9)', // Slight opacity to see BG
                backdropFilter: 'blur(5px)',
                position: 'relative',
                zIndex: 10 // Ensure form is clickable
            }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '30px', textAlign: 'center', lineHeight: 1 }}>WELCOME <br /><span style={{ color: 'var(--accent)' }}>BACK</span></h2>
                {error && <div style={{ background: 'var(--error)', color: 'white', padding: '10px', border: '2px solid black', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}
                <form onSubmit={onSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            onKeyDown={playTypingSound}
                            required
                            className="neo-input"
                            style={{ border: '3px solid black' }}
                        />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            onKeyDown={playTypingSound}
                            required
                            className="neo-input"
                            style={{ border: '3px solid black' }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>Login As</label>
                        <select
                            name="role"
                            value={role}
                            onChange={onChange}
                            className="neo-input"
                            style={{ border: '3px solid black' }}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" onClick={playButtonPress} className="neo-btn" style={{ width: '100%', padding: '15px', fontSize: '1.2rem', fontWeight: '800', border: '3px solid black' }}>LOGIN</button>
                </form>
                <p style={{ marginTop: '20px', textAlign: 'center', fontWeight: '500' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 'bold', textDecoration: 'underline' }}>REGISTER</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
