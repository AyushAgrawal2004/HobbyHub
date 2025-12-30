import { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const CreateGroup = () => {
    const [formData, setFormData] = useState({ name: '', description: '', category: '', image: '' });
    const navigate = useNavigate();

    const { name, description, category, image } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            await api.post('/groups', formData);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    const playButtonPress = () => {
        const audio = new Audio('/sounds/button_press.mp3');
        audio.play().catch(() => { });
    };

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '50px' }}>
            <div className="container" style={{ maxWidth: '600px' }}>
                <div className="neo-card" style={{ padding: '40px', border: '3px solid black', boxShadow: '10px 10px 0px 0px black' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '30px', textAlign: 'center', lineHeight: 0.9 }}>CREATE A <br /> <span style={{ color: 'var(--accent)' }}>NEW GROUP</span></h2>
                    <form onSubmit={onSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>Group Name</label>
                            <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={onChange}
                                required
                                className="neo-input"
                                style={{ border: '3px solid black' }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>Category</label>
                            <select
                                name="category"
                                value={category}
                                onChange={onChange}
                                required
                                className="neo-input"
                                style={{ border: '3px solid black' }}
                            >
                                <option value="">Select a Category</option>
                                <option value="Technology">Technology</option>
                                <option value="Sports">Sports</option>
                                <option value="Arts">Arts</option>
                                <option value="Music">Music</option>
                                <option value="Gaming">Gaming</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>Image URL (Optional)</label>
                            <input
                                type="text"
                                name="image"
                                value={image}
                                onChange={onChange}
                                placeholder="https://example.com/image.jpg"
                                className="neo-input"
                                style={{ border: '3px solid black' }}
                            />
                        </div>
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>Description</label>
                            <textarea
                                name="description"
                                value={description}
                                onChange={onChange}
                                required
                                rows="5"
                                className="neo-input"
                                style={{ width: '100%', border: '3px solid black', resize: 'vertical' }}
                            ></textarea>
                        </div>
                        <button type="submit" onClick={playButtonPress} className="neo-btn" style={{ width: '100%', padding: '15px', fontSize: '1.2rem', fontWeight: '800', border: '3px solid black' }}>CREATE GROUP</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateGroup;
