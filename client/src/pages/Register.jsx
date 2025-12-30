import { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { username, email, password } = formData;

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
            const res = await api.post('/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
        }
    };

    const playButtonPress = () => {
        const audio = new Audio('/sounds/button_press.mp3');
        audio.play().catch(() => { });
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '60px' }}>
            <div className="neo-card" style={{ padding: '40px', width: '90%', maxWidth: '450px', border: '3px solid black', boxShadow: '10px 10px 0px 0px black' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '30px', textAlign: 'center', lineHeight: 0.9 }}>CREATE <br /><span style={{ color: 'var(--accent)' }}>ACCOUNT</span></h2>
                {error && <div style={{ background: 'var(--error)', color: 'white', padding: '10px', border: '2px solid black', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}
                <form onSubmit={onSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={onChange}
                            onKeyDown={playTypingSound}
                            required
                            className="neo-input"
                            style={{ border: '3px solid black' }}
                        />
                    </div>
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
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>Role</label>
                        <select
                            name="role"
                            value={formData.role || 'user'}
                            onChange={onChange}
                            className="neo-input"
                            style={{ border: '3px solid black' }}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" onClick={playButtonPress} className="neo-btn" style={{ width: '100%', padding: '15px', fontSize: '1.2rem', fontWeight: '800', border: '3px solid black' }}>REGISTER</button>
                </form>
                <p style={{ marginTop: '20px', textAlign: 'center', fontWeight: '500' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 'bold', textDecoration: 'underline' }}>LOGIN</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
