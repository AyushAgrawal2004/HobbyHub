import { useState } from 'react';
import api from '../utils/api';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const CreateEvent = () => {
    const { groupId } = useParams();
    const locationState = useLocation();
    const groupName = locationState.state?.groupName || 'Group';
    const [formData, setFormData] = useState({ title: '', description: '', date: '', time: '', location: '' });
    const navigate = useNavigate();

    const { title, description, date, time, location } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            // Combine date and time
            const dateTime = new Date(`${date}T${time}`);

            const formattedData = {
                title,
                description,
                location,
                date: dateTime.toISOString(),
                groupId
            };

            await api.post('/events', formattedData);
            navigate(`/group/${groupId}`);
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
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '30px', textAlign: 'center', lineHeight: 1 }}>CREATE EVENT FOR <br /> <span style={{ color: 'var(--accent)' }}>{groupName.toUpperCase()}</span></h2>
                    <form onSubmit={onSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>Event Title</label>
                            <input
                                type="text"
                                name="title"
                                value={title}
                                onChange={onChange}
                                required
                                className="neo-input"
                                style={{ border: '3px solid black' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={date}
                                    onChange={onChange}
                                    required
                                    className="neo-input"
                                    style={{ border: '3px solid black' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>Time</label>
                                <input
                                    type="time"
                                    name="time"
                                    value={time}
                                    onChange={onChange}
                                    required
                                    className="neo-input"
                                    style={{ border: '3px solid black' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>Location</label>
                            <input
                                type="text"
                                name="location"
                                value={location}
                                onChange={onChange}
                                required
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
                        <button type="submit" onClick={playButtonPress} className="neo-btn" style={{ width: '100%', padding: '15px', fontSize: '1.2rem', fontWeight: '800', border: '3px solid black' }}>CREATE EVENT</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;
