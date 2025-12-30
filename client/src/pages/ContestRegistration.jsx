import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, User, CheckCircle, Plus, Trash2 } from 'lucide-react';
import api from '../utils/api';
import { playButtonPress } from '../utils/audio';

const ContestRegistration = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const contestId = location.state?.contestId;

    const [registrationType, setRegistrationType] = useState('individual'); // 'individual' or 'group'
    const [members, setMembers] = useState([{ name: '', mobile: '', address: '' }]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleTypeChange = (type) => {
        playButtonPress();
        setRegistrationType(type);
        // Reset members when switching type
        if (type === 'individual') {
            setMembers([{ name: '', mobile: '', address: '' }]);
        } else {
            // Start with 2 members for a group by default, or just 1 as base
            setMembers([{ name: '', mobile: '', address: '' }]);
        }
    };

    const handleMemberChange = (index, field, value) => {
        const newMembers = [...members];
        newMembers[index][field] = value;
        setMembers(newMembers);
    };

    const addMember = () => {
        playButtonPress();
        setMembers([...members, { name: '', mobile: '', address: '' }]);
    };

    const removeMember = (index) => {
        playButtonPress();
        if (members.length > 1) {
            const newMembers = members.filter((_, i) => i !== index);
            setMembers(newMembers);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        playButtonPress();

        if (!contestId) {
            alert("Error: No contest selected.");
            return;
        }

        // Basic validation
        for (const member of members) {
            if (!member.name || !member.mobile || !member.address) {
                alert('Please fill in all fields for all members.');
                return;
            }
        }

        setLoading(true);

        try {
            await api.post('/registrations', {
                contestId,
                type: registrationType,
                members
            });
            setSuccess(true);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', maxWidth: '500px' }}>
                    <CheckCircle size={64} color="var(--success)" style={{ marginBottom: '20px' }} />
                    <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Registration Successful!</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                        You have successfully registered for the contest as {registrationType === 'group' ? 'a Group' : 'an Individual'}.
                    </p>
                    <button onClick={() => { playButtonPress(); navigate('/dashboard'); }} className="btn btn-primary">Return to Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '50px' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="neo-card" style={{ padding: '40px', background: 'var(--bg-secondary)', border: '4px solid black', boxShadow: '12px 12px 0px black' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '10px', textAlign: 'center', textTransform: 'uppercase' }}>Event Registration</h1>
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px', fontWeight: 'bold' }}>
                        REGISTER FOR TODAY'S CONTEST
                    </p>

                    <form onSubmit={handleSubmit}>
                        {/* Registration Type Selection */}
                        <div style={{ marginBottom: '40px' }}>
                            <label style={{ display: 'block', marginBottom: '15px', fontSize: '1.2rem', fontWeight: '800', textTransform: 'uppercase' }}>Registration Type</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div
                                    onClick={() => handleTypeChange('individual')}
                                    style={{
                                        padding: '20px',
                                        border: '3px solid black',
                                        background: registrationType === 'individual' ? 'var(--accent)' : 'white',
                                        color: registrationType === 'individual' ? 'white' : 'black',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        transition: 'all 0.1s ease',
                                        boxShadow: registrationType === 'individual' ? '4px 4px 0px black' : 'none',
                                        transform: registrationType === 'individual' ? 'translate(-2px, -2px)' : 'none'
                                    }}
                                >
                                    <User size={32} color={registrationType === 'individual' ? 'white' : 'black'} style={{ marginBottom: '10px' }} />
                                    <span style={{ fontWeight: '800', textTransform: 'uppercase' }}>Individual</span>
                                </div>

                                <div
                                    onClick={() => handleTypeChange('group')}
                                    style={{
                                        padding: '20px',
                                        border: '3px solid black',
                                        background: registrationType === 'group' ? 'var(--accent)' : 'white',
                                        color: registrationType === 'group' ? 'white' : 'black',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        transition: 'all 0.1s ease',
                                        boxShadow: registrationType === 'group' ? '4px 4px 0px black' : 'none',
                                        transform: registrationType === 'group' ? 'translate(-2px, -2px)' : 'none'
                                    }}
                                >
                                    <Users size={32} color={registrationType === 'group' ? 'white' : 'black'} style={{ marginBottom: '10px' }} />
                                    <span style={{ fontWeight: '800', textTransform: 'uppercase' }}>Group</span>
                                </div>
                            </div>
                        </div>

                        {/* Member Details */}
                        <div style={{ marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textTransform: 'uppercase' }}>
                                {registrationType === 'individual' ? 'Personal Details' : 'Team Members Details'}
                                {registrationType === 'group' && (
                                    <button type="button" onClick={addMember} className="neo-btn" style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', background: 'white' }}>
                                        <Plus size={16} /> ADD MEMBER
                                    </button>
                                )}
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {members.map((member, index) => (
                                    <div key={index} style={{
                                        padding: '20px',
                                        background: 'white',
                                        border: '3px solid black',
                                        position: 'relative',
                                        boxShadow: '6px 6px 0px rgba(0,0,0,0.1)'
                                    }}>
                                        {registrationType === 'group' && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '2px solid black', paddingBottom: '10px' }}>
                                                <h4 style={{ textTransform: 'uppercase', fontWeight: '800' }}>Member {index + 1}</h4>
                                                {members.length > 1 && (
                                                    <button type="button" onClick={() => removeMember(index)} style={{ background: 'var(--error)', color: 'white', border: '2px solid black', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Full Name</label>
                                                <input
                                                    type="text"
                                                    value={member.name}
                                                    onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                                                    placeholder="JOHN DOE"
                                                    required
                                                    className="neo-input"
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Mobile Number</label>
                                                <input
                                                    type="tel"
                                                    value={member.mobile}
                                                    onChange={(e) => handleMemberChange(index, 'mobile', e.target.value)}
                                                    placeholder="+1 234 567 890"
                                                    required
                                                    className="neo-input"
                                                />
                                            </div>
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Address</label>
                                                <input
                                                    type="text"
                                                    value={member.address}
                                                    onChange={(e) => handleMemberChange(index, 'address', e.target.value)}
                                                    placeholder="123 MAIN ST, CITY, COUNTRY"
                                                    required
                                                    className="neo-input"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="neo-btn"
                            style={{ width: '100%', padding: '20px', fontSize: '1.2rem', background: 'black', color: 'white', boxShadow: '8px 8px 0px var(--accent)' }}
                            disabled={loading}
                        >
                            {loading ? 'REGISTERING...' : 'COMPLETE REGISTRATION'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContestRegistration;
