import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await api.get('/groups');
                setGroups(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchGroups();
    }, []);

    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh' }}>

            {/* Hero Section */}
            <div className="container" style={{ padding: '100px 20px', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                >
                    <h1 className="text-giant" style={{ color: 'var(--text-primary)', marginBottom: '0' }}>FIND</h1>
                    <h1 className="text-giant" style={{ color: 'transparent', WebkitTextStroke: '2px var(--text-primary)', marginTop: '-0.3em', marginLeft: '50px' }}>YOUR</h1>
                    <h1 className="text-giant text-stroke" style={{ color: 'var(--accent)', WebkitTextStroke: '2px black', marginTop: '-0.3em' }}>TRIBE.</h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: '500',
                        maxWidth: '500px',
                        marginTop: '40px',
                        borderLeft: '4px solid var(--accent-lime)',
                        paddingLeft: '20px'
                    }}
                >
                    Connect with people who share your weirdest passions. Join local clubs, attend events, and build lasting chaos.
                </motion.p>

                <motion.button
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="neo-btn"
                    style={{ marginTop: '40px', fontSize: '1.5rem', padding: '20px 40px', fontWeight: '800' }}
                    onClick={() => document.getElementById('groups-section').scrollIntoView({ behavior: 'smooth' })}
                >
                    EXPLORE GROUPS →
                </motion.button>

                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: '10%', right: '5%', width: '150px', height: '150px', background: 'var(--accent-lime)', borderRadius: '50%', filter: 'blur(40px)', opacity: 0.6, zIndex: -1 }}></div>
            </div>

            {/* Marquee */}
            <div style={{ background: 'var(--text-primary)', padding: '20px 0', transform: 'rotate(2deg)', marginTop: '50px', marginBottom: '80px', borderTop: '4px solid var(--accent-lime)', borderBottom: '4px solid var(--accent-lime)', width: '105%', marginLeft: '-2.5%' }}>
                <div className="animate-marquee" style={{ color: 'var(--accent-lime)', fontSize: '2rem', fontWeight: '800', fontFamily: 'Syne' }}>
                    HOBBY HUB • JOIN THE CHAOS • BUILD SOMETHING • PLAY HARD • HOBBY HUB • JOIN THE CHAOS • BUILD SOMETHING • PLAY HARD •
                </div>
            </div>

            {/* Groups Grid */}
            <div id="groups-section" className="container" style={{ paddingBottom: '100px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '4rem', color: 'var(--text-primary)', margin: 0 }}>POPULAR</h2>
                    <span style={{ fontSize: '1.5rem', fontWeight: '700', paddingBottom: '15px' }}>// GROUPS</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '40px' }}>
                    {groups.map((group, index) => (
                        <motion.div
                            key={group._id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10, boxShadow: '8px 8px 0px 0px #000000' }}
                            className="neo-card"
                            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{ height: '200px', border: '3px solid black', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
                                {group.image ? (
                                    <img src={group.image} alt={group.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)', transition: 'filter 0.3s' }}
                                        onMouseOver={e => e.currentTarget.style.filter = 'none'}
                                        onMouseOut={e => e.currentTarget.style.filter = 'grayscale(100%)'}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: 'var(--accent-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '800' }}>
                                        {group.name[0]}
                                    </div>
                                )}
                            </div>

                            <h3 style={{ fontSize: '2rem', marginBottom: '10px' }}>{group.name}</h3>

                            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                <span style={{ padding: '4px 12px', background: 'black', color: 'white', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                                    {group.category}
                                </span>
                            </div>

                            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', flex: 1, fontFamily: 'Space Grotesk', fontWeight: '500' }}>
                                {group.description.substring(0, 100)}...
                            </p>

                            <Link to={`/group/${group._id}`} className="neo-btn neo-btn-secondary" style={{ textAlign: 'center', width: '100%', border: '2px solid black' }}>
                                VIEW GROUP
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
