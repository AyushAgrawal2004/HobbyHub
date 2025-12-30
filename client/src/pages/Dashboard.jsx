import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
// import OnboardingTutorial from '../components/OnboardingTutorial'; 
import IntroAnimation from '../components/IntroAnimation'; // Replaced OnboardingTutorial
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { playButtonPress } from '../utils/audio';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTutorial, setShowTutorial] = useState(false);
    const containerRef = useRef();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/auth/me');
                setUser(res.data);

                // Show tutorial only if not seen in this session
                const hasSeenTutorial = sessionStorage.getItem('hasSeenTutorial');
                if (!hasSeenTutorial) {
                    setShowTutorial(true);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    useGSAP(() => {
        if (!loading && containerRef.current) {
            gsap.from('.dashboard-item', {
                y: 30,
                autoAlpha: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
                clearProps: 'all'
            });
        }
    }, [loading, user]);

    const handleTutorialComplete = () => {
        setShowTutorial(false);
        sessionStorage.setItem('hasSeenTutorial', 'true');
    };

    if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div ref={containerRef} style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '50px' }}>
            {showTutorial && createPortal(
                <IntroAnimation isSplash={true} onIntroComplete={handleTutorialComplete} />,
                document.body
            )}

            <div className="container">
                {/* Bento Grid Layout - Responsive */}
                <div className="bento-grid">

                    {/* Welcome Card - Span 8 */}
                    <div className="neo-card dashboard-item col-span-8" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h1 style={{ fontSize: '3.5rem', marginBottom: '10px', lineHeight: 1 }}>WELCOME, <br /><span style={{ color: 'var(--accent)' }}>{user?.username}!</span></h1>
                        <p style={{ color: 'var(--text-secondary)', fontWeight: '500', fontSize: '1.2rem' }}>
                            {user?.role === 'admin' ? 'SYSTEM CONTROL PANEL ACTIVE' : 'MANAGE YOUR CHAOS HERE.'}
                        </p>
                    </div>

                    {/* Stats/Action Card - Span 4 */}
                    <div className="neo-card dashboard-item col-span-4" style={{ background: 'var(--accent-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <div>
                            <span style={{ fontSize: '4rem', fontWeight: '800', lineHeight: 1 }}>{user?.joinedGroups?.length || 0}</span>
                            <div style={{ fontWeight: '700', textTransform: 'uppercase' }}>Active Groups</div>
                        </div>
                    </div>

                    {/* Contest Section - Span 12 */}
                    <div className="dashboard-item col-span-12">
                        <ContestSection isAdmin={user?.role === 'admin'} />
                    </div>

                    {user?.role === 'admin' && (
                        <div className="col-span-12">
                            <AdminGroupList />
                            <AdminUserList />
                        </div>
                    )}

                    <div className="col-span-12" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                        <h2 style={{ fontSize: '2.5rem', background: 'black', color: 'white', padding: '0 10px' }}>MY GROUPS</h2>
                        <Link to="/create-group" className="neo-btn" onClick={playButtonPress}>CREATE GROUP +</Link>
                    </div>

                    {user?.joinedGroups?.length > 0 ? (
                        user.joinedGroups.map((group, index) => (
                            <div
                                key={group._id}
                                className="neo-card dashboard-item col-span-4"
                                style={{ minHeight: '250px', display: 'flex', flexDirection: 'column' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                    <h3 style={{ fontSize: '1.8rem', lineHeight: 1 }}>{group.name}</h3>
                                    <span style={{ padding: '4px 8px', border: '2px solid black', fontSize: '0.8rem', fontWeight: 'bold' }}>{group.category}</span>
                                </div>

                                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', flex: 1, fontWeight: '500', fontSize: '0.95rem' }}>
                                    {group.description.substring(0, 100)}...
                                </p>

                                <Link
                                    to={`/group/${group._id}`}
                                    className="neo-btn neo-btn-secondary"
                                    style={{ textAlign: 'center', border: '2px solid black' }}
                                    onClick={playButtonPress}
                                >
                                    OPEN CHANNEL
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="neo-card dashboard-item col-span-12" style={{ textAlign: 'center', padding: '60px' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>NO GROUPS FOUND.</p>
                            <Link to="/" className="neo-btn" onClick={playButtonPress}>EXPLORE GROUPS</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

const AdminGroupList = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/groups').then(res => {
            setGroups(res.data);
            setLoading(false);
        });
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this group?')) return;
        try {
            await api.delete(`/groups/${id}`);
            setGroups(groups.filter(g => g._id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to delete group');
        }
    };

    const handleRestrict = async (id) => {
        try {
            const res = await api.put(`/groups/${id}/restrict`);
            setGroups(groups.map(g => g._id === id ? res.data : g));
        } catch (err) {
            console.error(err);
            alert('Failed to update group');
        }
    };

    if (loading) return <div>Loading groups...</div>;

    return (
        <div style={{ marginBottom: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem', background: 'black', color: 'white', padding: '0 10px' }}>ALL GROUPS</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                {groups.map((group) => (
                    <div key={group._id} className="neo-card" style={{ padding: '20px', position: 'relative', border: group.isRestricted ? '3px solid var(--error)' : '3px solid black' }}>
                        {group.isRestricted && <div style={{ position: 'absolute', top: -15, right: -10, background: 'var(--error)', color: 'white', padding: '4px 12px', border: '2px solid black', fontWeight: 'bold' }}>BANNED</div>}
                        <h3 style={{ fontSize: '1.5rem' }}>{group.name}</h3>
                        <p style={{ color: 'var(--text-secondary)', margin: '10px 0', fontWeight: '500' }}>{group.description.substring(0, 80)}...</p>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                            <button onClick={() => { playButtonPress(); handleDelete(group._id); }} style={{ background: 'var(--error)', color: 'white', border: '2px solid black', padding: '5px 10px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '2px 2px 0px black' }}>DEL</button>
                            <button onClick={() => { playButtonPress(); handleRestrict(group._id); }} style={{ background: 'var(--accent)', color: 'white', border: '2px solid black', padding: '5px 10px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '2px 2px 0px black' }}>
                                {group.isRestricted ? 'FREE' : 'BAN'}
                            </button>
                            <Link to={`/group/${group._id}`} onClick={playButtonPress} className="neo-btn neo-btn-secondary" style={{ fontSize: '0.8rem', padding: '5px 10px', border: '2px solid black' }}>VIEW</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/users').then(res => {
            setUsers(res.data);
            setLoading(false);
        });
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Confirm deletion?')) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem', background: 'black', color: 'white', padding: '0 10px' }}>USER DATABASE</h2>
            </div>
            <div className="neo-card" style={{ padding: '0', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'black', color: 'white' }}>
                            <th style={{ padding: '15px', borderBottom: '3px solid black' }}>USERNAME</th>
                            <th style={{ padding: '15px', borderBottom: '3px solid black' }}>EMAIL</th>
                            <th style={{ padding: '15px', borderBottom: '3px solid black' }}>ROLE</th>
                            <th style={{ padding: '15px', borderBottom: '3px solid black' }}>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} style={{ borderBottom: '2px solid black', background: 'white' }}>
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>{user.username}</td>
                                <td style={{ padding: '15px', fontFamily: 'monospace' }}>{user.email}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        background: user.role === 'admin' ? 'var(--accent-lime)' : 'transparent',
                                        border: user.role === 'admin' ? '2px solid black' : 'none',
                                        color: 'black',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    {user.role !== 'admin' && (
                                        <button
                                            onClick={() => { playButtonPress(); handleDelete(user._id); }}
                                            style={{ color: 'white', background: 'var(--error)', border: '2px solid black', cursor: 'pointer', fontWeight: 'bold', padding: '4px 8px', boxShadow: '2px 2px 0px black' }}
                                        >
                                            NUKE
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ContestSection = ({ isAdmin }) => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
    const [myRegistrations, setMyRegistrations] = useState([]); // Array of contest IDs

    const fetchContests = async () => {
        try {
            const res = await api.get('/contests');
            setContests(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const fetchMyRegistrations = async () => {
        if (isAdmin) return; // Admins don't register, so no need to fetch
        try {
            const res = await api.get('/registrations/my');
            // Store just the contest IDs for easy lookup
            const ids = res.data.map(reg => reg.contest);
            setMyRegistrations(ids);
        } catch (err) {
            console.error("Error fetching my registrations:", err);
        }
    };

    useEffect(() => {
        fetchContests();
        fetchMyRegistrations();
    }, []);

    useEffect(() => {
        if (contests.length === 0) return;
        const interval = setInterval(() => {
            if (!showDetailsModal && !showCreateModal && !showRegistrationsModal) {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % contests.length);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [showDetailsModal, showCreateModal, showRegistrationsModal, contests.length]);

    const contest = contests[currentIndex];

    if (loading) return <div>Loading contests...</div>;
    // If no contest provided
    if (!contest) {
        return (
            <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px', textAlign: 'center', background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--text-primary)' }}>NO ACTIVE CONTESTS</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                    CHECK BACK LATER FOR NEW CHALLENGES AND PRIZES!
                </p>
                {isAdmin && (
                    <button onClick={() => { playButtonPress(); setShowCreateModal(true); }} className="neo-btn">CREATE FIRST CONTEST</button>
                )}
                {/* Render Create Modal if needed */}
                {showCreateModal && <CreateContestModal onClose={() => setShowCreateModal(false)} onCreated={fetchContests} />}
            </div>
        );
    }

    return (
        <>
            <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px', textAlign: 'left', background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden', minHeight: '300px' }}>


                {isAdmin && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        <button
                            onClick={() => { playButtonPress(); setShowCreateModal(true); }}
                            className="neo-btn"
                            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                        >
                            + NEW CONTEST
                        </button>
                    </div>
                )}

                <AnimatePresence mode='wait'>
                    <motion.div
                        key={contest._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        style={{ width: '100%' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--text-primary)' }}>{contest.title}</h2>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '1.1rem', lineHeight: '1.6' }}>
                                    {contest.description}
                                </p>
                                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <strong>Deadline:</strong> {contest.deadline}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <strong>Participants:</strong> {contest.participants}
                                    </span>
                                </div>
                                <div style={{ background: 'rgba(192, 160, 128, 0.1)', padding: '15px', borderRadius: '10px', marginBottom: '20px', borderLeft: '4px solid var(--accent)' }}>
                                    <strong style={{ display: 'block', marginBottom: '5px', color: 'var(--accent-hover)' }}>🏆 Prize</strong>
                                    {contest.prize}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', minWidth: '200px' }}>
                                {!isAdmin ? (
                                    myRegistrations.includes(contest._id) ? (
                                        <button
                                            disabled
                                            className="neo-btn"
                                            style={{
                                                textAlign: 'center',
                                                background: '#cccccc',
                                                color: '#666666',
                                                cursor: 'not-allowed',
                                                border: '3px solid #999999'
                                            }}
                                        >
                                            ALREADY REGISTERED
                                        </button>
                                    ) : (
                                        <Link
                                            to="/contest-registration"
                                            state={{ contestId: contest._id }}
                                            className="neo-btn"
                                            style={{ textAlign: 'center', background: 'var(--accent)', color: 'white' }}
                                            onClick={playButtonPress}
                                        >
                                            REGISTER NOW
                                        </Link>
                                    )
                                ) : (
                                    <button
                                        onClick={() => { playButtonPress(); setShowRegistrationsModal(true); }}
                                        className="neo-btn"
                                        style={{ textAlign: 'center', background: 'var(--accent)', color: 'white' }}
                                    >
                                        VIEW REGISTRATIONS
                                    </button>
                                )}
                                <button
                                    onClick={() => { playButtonPress(); setShowDetailsModal(true); }}
                                    className="neo-btn"
                                    style={{ textAlign: 'center', background: 'white', border: '3px solid black' }}
                                >
                                    VIEW DETAILS
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Dots Indicator */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
                    {contests.map((_, idx) => (
                        <div
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: idx === currentIndex ? 'var(--accent)' : 'var(--text-secondary)',
                                opacity: idx === currentIndex ? 1 : 0.3,
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Details Modal Portal */}
            {createPortal(
                <AnimatePresence>
                    {showDetailsModal && (
                        <div style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.6)', zIndex: 9999,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backdropFilter: 'blur(5px)',
                            padding: '20px'
                        }}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="glass-panel"
                                style={{
                                    maxWidth: '600px',
                                    width: '100%',
                                    background: 'var(--bg-primary)',
                                    maxHeight: '90vh',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: '0',
                                    overflow: 'hidden',
                                    border: '3px solid black',
                                    boxShadow: '10px 10px 0px black'
                                }}
                            >
                                <div style={{ padding: '20px 30px', borderBottom: '3px solid black', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                                    <h2 style={{ color: 'black', margin: 0, fontSize: '1.5rem', textTransform: 'uppercase' }}>{contest.title}</h2>
                                    <button onClick={() => { playButtonPress(); setShowDetailsModal(false); }} style={{ background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: 'black', lineHeight: 0.5 }}>&times;</button>
                                </div>

                                <div style={{ padding: '30px', overflowY: 'auto', flex: 1 }}>
                                    <div style={{ marginBottom: '25px' }}>
                                        <h3 style={{ marginBottom: '10px', textTransform: 'uppercase' }}>About the Challenge</h3>
                                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{contest.details || contest.description}</p>
                                    </div>

                                    {contest.rules && contest.rules.length > 0 && (
                                        <div style={{ marginBottom: '25px' }}>
                                            <h3 style={{ marginBottom: '10px', textTransform: 'uppercase' }}>Rules & Guidelines</h3>
                                            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
                                                {contest.rules.map((rule, i) => (
                                                    <li key={i} style={{ marginBottom: '8px' }}>{rule}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div style={{ marginBottom: '10px' }}>
                                        <h3 style={{ marginBottom: '10px', textTransform: 'uppercase' }}>Prize</h3>
                                        <p style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>{contest.prize}</p>
                                    </div>
                                </div>

                                <div style={{ padding: '20px 30px', borderTop: '3px solid black', background: 'var(--bg-secondary)' }}>
                                    {!isAdmin ? (
                                        myRegistrations.includes(contest._id) ? (
                                            <button
                                                disabled
                                                className="neo-btn"
                                                style={{
                                                    display: 'block',
                                                    textAlign: 'center',
                                                    width: '100%',
                                                    background: '#cccccc',
                                                    color: '#666666',
                                                    cursor: 'not-allowed',
                                                    border: '3px solid #999999'
                                                }}
                                            >
                                                ALREADY REGISTERED
                                            </button>
                                        ) : (
                                            <Link
                                                to="/contest-registration"
                                                state={{ contestId: contest._id }}
                                                className="neo-btn"
                                                style={{ display: 'block', textAlign: 'center', width: '100%', background: 'var(--accent)', color: 'white' }}
                                                onClick={playButtonPress}
                                            >
                                                PROCEED TO REGISTRATION
                                            </Link>
                                        )
                                    ) : (
                                        <button className="neo-btn" style={{ display: 'block', textAlign: 'center', width: '100%', background: 'var(--text-primary)', color: 'white' }}>
                                            ADMIN VIEW DOES NOT REGISTER
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* Create Contest Modal */}
            {showCreateModal && <CreateContestModal onClose={() => setShowCreateModal(false)} onCreated={fetchContests} />}

            {/* View Registrations Modal (Admin Only) */}
            {isAdmin && <ViewRegistrationsModal contest={contest} isOpen={showRegistrationsModal} onClose={() => setShowRegistrationsModal(false)} />}
        </>
    );
};

const ViewRegistrationsModal = ({ contest, isOpen, onClose }) => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && contest) {
            setLoading(true);
            api.get(`/registrations/contest/${contest._id}`)
                .then(res => {
                    setRegistrations(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch registrations:", err);
                    setLoading(false);
                });
        }
    }, [isOpen, contest]);

    if (!isOpen || !contest) return null;

    return createPortal(
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(5px)',
            padding: '20px'
        }}>
            <div className="neo-card" style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', background: 'white', padding: '0', border: '3px solid black', boxShadow: '10px 10px 0px black' }}>
                <div style={{ padding: '20px', borderBottom: '3px solid black', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', textTransform: 'uppercase', marginBottom: '5px' }}>Registered Users</h2>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>For: {contest.title}</p>
                    </div>
                    <button onClick={() => { playButtonPress(); onClose(); }} style={{ background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', lineHeight: 0.5 }}>&times;</button>
                </div>

                <div style={{ padding: '20px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
                    ) : registrations.length > 0 ? (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid black' }}>
                                    <th style={{ padding: '10px', textTransform: 'uppercase' }}>User</th>
                                    <th style={{ padding: '10px', textTransform: 'uppercase' }}>Contact/Members</th>
                                    <th style={{ padding: '10px', textTransform: 'uppercase' }}>Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map((reg, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '10px' }}>
                                            <div style={{ fontWeight: 'bold' }}>{reg.user.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'gray' }}>{reg.user.email}</div>
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            {reg.type === 'individual' ? (
                                                <div>
                                                    <div>{reg.members[0].mobile}</div>
                                                    <div style={{ fontSize: '0.8rem' }}>{reg.members[0].address}</div>
                                                </div>
                                            ) : (
                                                <div style={{ fontSize: '0.9rem' }}>
                                                    {reg.members.length} members
                                                    <details style={{ marginTop: '5px', cursor: 'pointer' }}>
                                                        <summary>View Team</summary>
                                                        <ul style={{ paddingLeft: '15px', marginTop: '5px' }}>
                                                            {reg.members.map((m, idx) => (
                                                                <li key={idx}>{m.name} ({m.mobile})</li>
                                                            ))}
                                                        </ul>
                                                    </details>
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            <span style={{
                                                background: reg.type === 'group' ? 'var(--accent-lime)' : 'rgba(0,0,0,0.1)',
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', border: '1px solid black'
                                            }}>
                                                {reg.type.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No registrations yet.</div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

const CreateContestModal = ({ onClose, onCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        details: '',
        rules: '', // multiline string, will split by newlines
        prize: '',
        deadline: ''
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("Submitting form...", formData);
        setLoading(true);
        try {
            const rulesArray = formData.rules.split('\n').filter(r => r.trim() !== '');
            const res = await api.post('/contests', { ...formData, rules: rulesArray });
            // console.log("Response:", res.data);
            alert('Contest Created Successfully!');
            onCreated();
            onClose();
        } catch (err) {
            console.error(err);
            alert('Error creating contest: ' + (err.response?.data?.msg || err.message));
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(5px)',
            padding: '20px'
        }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-primary)', padding: '30px', border: '3px solid black', boxShadow: '10px 10px 0px black' }}>
                <h2 style={{ marginBottom: '20px', fontSize: '2rem', textTransform: 'uppercase' }}>Create New Contest</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="text"
                        placeholder="CONTEST TITLE"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="neo-input"
                    />
                    <textarea
                        placeholder="SHORT DESCRIPTION"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        required
                        rows={3}
                        className="neo-input"
                    />
                    <textarea
                        placeholder="DETAILED DESCRIPTION (ABOUT THE CHALLENGE)"
                        value={formData.details}
                        onChange={e => setFormData({ ...formData, details: e.target.value })}
                        rows={5}
                        className="neo-input"
                    />
                    <textarea
                        placeholder="RULES (ONE PER LINE)"
                        value={formData.rules}
                        onChange={e => setFormData({ ...formData, rules: e.target.value })}
                        rows={5}
                        className="neo-input"
                    />
                    <input
                        type="text"
                        placeholder="PRIZE"
                        value={formData.prize}
                        onChange={e => setFormData({ ...formData, prize: e.target.value })}
                        required
                        className="neo-input"
                    />
                    <input
                        type="text"
                        placeholder="DEADLINE (E.G., ENDS IN 2 DAYS)"
                        value={formData.deadline}
                        onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                        required
                        className="neo-input"
                    />

                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                        <button type="button" onClick={() => { playButtonPress(); onClose(); }} className="neo-btn" style={{ flex: 1, background: 'white', border: '3px solid black' }}>CANCEL</button>
                        <button type="submit" onClick={playButtonPress} className="neo-btn" disabled={loading} style={{ flex: 1, background: 'var(--accent)' }}>
                            {loading ? 'CREATING...' : 'CREATE CONTEST'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default Dashboard;
