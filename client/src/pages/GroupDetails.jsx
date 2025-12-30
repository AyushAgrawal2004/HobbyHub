import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useParams, Link } from 'react-router-dom';
import ChatRoom from '../components/ChatRoom';
import { playButtonPress } from '../utils/audio';

const GroupDetails = () => {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMember, setIsMember] = useState(false);
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const groupRes = await api.get(`/groups/${id}`);
                setGroup(groupRes.data);

                const eventsRes = await api.get(`/events/group/${id}`);
                setEvents(eventsRes.data);

                const userRes = await api.get('/auth/me');
                setUser(userRes.data);

                if (groupRes.data.members.some(member => member._id === userRes.data._id)) {
                    setIsMember(true);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleJoin = async () => {
        try {
            await api.post(`/groups/${id}/join`);
            setIsMember(true);
            // Refresh group data
            const res = await api.get(`/groups/${id}`);
            setGroup(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLeave = async () => {
        if (!window.confirm('Are you sure you want to leave this group?')) return;
        try {
            await api.post(`/groups/${id}/leave`);
            setIsMember(false);
            // Refresh group data
            const res = await api.get(`/groups/${id}`);
            setGroup(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading...</div>;
    if (!group) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Group not found</div>;

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '50px' }}>
            <div className="container">
                <div className="neo-card" style={{ padding: '40px', marginBottom: '40px', border: '3px solid black', boxShadow: '8px 8px 0px 0px black' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 style={{ fontSize: '3.5rem', marginBottom: '10px', lineHeight: 0.9 }}>{group.name}</h1>
                            <span style={{ display: 'inline-block', padding: '6px 16px', background: 'black', color: 'white', fontSize: '1rem', marginBottom: '20px', fontWeight: 'bold' }}>
                                {group.category}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            {isMember && (
                                <>
                                    <Link
                                        to={`/group/${id}/create-event`}
                                        state={{ groupName: group.name }}
                                        className="neo-btn neo-btn-secondary"
                                        style={{ border: '3px solid black', display: 'flex', alignItems: 'center' }}
                                        onClick={playButtonPress}
                                    >
                                        CREATE EVENT
                                    </Link>
                                    <button
                                        onClick={() => {
                                            playButtonPress();
                                            handleLeave();
                                        }}
                                        className="neo-btn"
                                        style={{ background: 'var(--error)', color: 'white', border: '3px solid black' }}
                                    >
                                        LEAVE GROUP
                                    </button>
                                </>
                            )}
                            {!isMember && (
                                <button
                                    onClick={() => {
                                        playButtonPress();
                                        handleJoin();
                                    }}
                                    className="neo-btn"
                                    style={{ fontSize: '1.2rem', padding: '15px 30px', border: '3px solid black' }}
                                >
                                    JOIN GROUP
                                </button>
                            )}
                        </div>
                    </div>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.6', fontWeight: '500' }}>{group.description}</p>
                </div>

                {/* Events Section */}
                <div className="glass-panel" style={{ padding: '40px', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Upcoming Events</h2>
                    {events.length > 0 ? (
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {events.map(event => (
                                <div key={event._id} style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{event.title}</h3>
                                    <p style={{ color: 'var(--accent)', marginBottom: '10px', fontWeight: '500' }}>
                                        {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()} • {event.location}
                                    </p>
                                    <p style={{ color: 'var(--text-secondary)' }}>{event.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>No events scheduled yet.</p>
                    )}
                </div>

                {/* Chat Section */}
                {isMember && user && (
                    <div style={{ marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Community Chat</h2>
                        <ChatRoom groupId={id} user={user} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupDetails;
