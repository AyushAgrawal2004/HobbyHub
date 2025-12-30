import { useRef, useEffect } from 'react';
import { Users, Heart, Shield, Globe, Zap, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { playButtonPress } from '../utils/audio';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const containerRef = useRef();

    useGSAP(() => {
        // Hero Timeline
        const heroTl = gsap.timeline();
        heroTl.from('.hero-text', { y: 100, opacity: 0, duration: 1, stagger: 0.2, ease: 'back.out(1.7)' })
            .from('.hero-badge', { scale: 0, rotation: -180, duration: 0.8, ease: 'elastic.out(1)' }, '-=0.5');

        // Panel Animations
        const panels = gsap.utils.toArray('.comic-panel');
        panels.forEach((panel, i) => {
            gsap.from(panel, {
                scrollTrigger: {
                    trigger: panel,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                x: i % 2 === 0 ? -50 : 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power4.out'
            });
        });

        // Speech Bubble Pop
        gsap.utils.toArray('.speech-bubble').forEach(bubble => {
            gsap.from(bubble, {
                scrollTrigger: {
                    trigger: bubble,
                    start: 'top 85%'
                },
                scale: 0,
                transformOrigin: 'bottom left',
                duration: 0.5,
                ease: 'back.out(2)'
            });
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="container" style={{ paddingTop: '100px', paddingBottom: '100px', maxWidth: '1200px' }}>

            {/* HERO: ISSUE #1 */}
            {/* HERO: ISSUE #1 */}
            {/* HERO: ISSUE #1 */}
            <div style={{
                borderBottom: '4px solid black',
                paddingBottom: '80px',
                marginBottom: '100px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', // Centered to keep them together
                flexWrap: 'wrap',
                gap: '40px' // Closer gap to "fit it in"
            }}>
                <div style={{ flex: '0 1 auto', zIndex: 10 }}> {/* Allow text to shrink/grow naturally */}
                    <div className="hero-text" style={{
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        background: 'black',
                        color: 'white',
                        display: 'inline-block',
                        padding: '4px 12px',
                        marginBottom: '20px',
                        transform: 'rotate(-2deg)'
                    }}>
                        ISSUE #1
                    </div>
                    <h1 className="hero-text" style={{ fontSize: 'clamp(4rem, 9vw, 8rem)', lineHeight: 0.85, marginBottom: '20px' }}>
                        THE <br /> ORIGIN <br /> <span style={{ color: 'transparent', WebkitTextStroke: '3px var(--accent)' }}>STORY</span>
                    </h1>
                </div>

                <div className="hero-badge" style={{
                    flex: '0 1 auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <img
                        src="/img/Hands - Book.png"
                        alt="Story Book"
                        style={{
                            width: '100%',
                            maxWidth: '300px',
                            filter: 'drop-shadow(15px 15px 0px black)',
                            transform: 'rotate(-5deg)', // Tilt slightly towards text
                            zIndex: 1
                        }}
                    />
                </div>
            </div>

            {/* PANEL 1: THE VILLAIN */}
            <div className="comic-panel" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '40px',
                marginBottom: '100px',
                border: '4px solid black',
                padding: '40px',
                background: 'white',
                boxShadow: '15px 15px 0px black',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-25px',
                    left: '20px',
                    background: 'var(--error)',
                    color: 'white',
                    padding: '10px 20px',
                    border: '4px solid black',
                    fontWeight: '800',
                    fontSize: '1.5rem',
                    transform: 'rotate(-3deg)'
                }}>
                    PART 1: THE ENEMY
                </div>

                <div>
                    <h2 style={{ fontSize: '3.5rem', marginBottom: '20px', lineHeight: 1 }}>THE WORLD WAS <br /><span style={{ background: 'black', color: 'white', padding: '0 8px' }}>SILENT.</span></h2>
                    <p style={{ fontSize: '1.4rem', lineHeight: '1.6', fontWeight: '500', color: 'var(--text-secondary)' }}>
                        It was a dark time. People were scrolling endlessly.
                        Hobbies were dying in dusty corners.
                        <br /><br />
                        The villain known as <strong>"THE ALGORITHM"</strong> kept everyone isolated,
                        feeding them content but starving them of connection.
                    </p>
                </div>
                <div style={{
                    minHeight: '250px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        fontSize: '3rem', fontWeight: '800', background: 'white', padding: '15px', border: '4px solid black',
                        boxShadow: '8px 8px 0px black', transform: 'rotate(-5deg)'
                    }}>
                        *DOOM SCROLLING*
                    </div>
                </div>
            </div>

            {/* PANEL 2: THE HERO ARRIVES */}
            <div className="comic-panel" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '50px',
                marginBottom: '120px',
                alignItems: 'center'
            }}>
                <div style={{
                    position: 'relative',
                    order: 2
                }}>
                    <img
                        src="/img/Hobbies - Control.png"
                        alt="Gaming Control"
                        className="bg-blob"
                        style={{
                            width: '100%',
                            maxWidth: '400px',
                            filter: 'drop-shadow(-12px 12px 0px black)',
                            transform: 'rotate(-10deg)',
                            border: '4px solid black',
                            background: 'var(--accent-lime)'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        top: '-40px',
                        left: '-40px',
                        fontSize: '4rem',
                        fontWeight: '900',
                        color: 'var(--accent)',
                        textShadow: '3px 3px 0px black',
                        zIndex: 2,
                        transform: 'rotate(-15deg)'
                    }}>
                        BAM!
                    </div>
                </div>

                <div style={{ padding: '20px', order: 1 }}>
                    <div className="speech-bubble" style={{
                        background: 'white',
                        border: '4px solid black',
                        padding: '30px',
                        marginBottom: '40px',
                        borderRadius: '30px',
                        position: 'relative',
                        boxShadow: '8px 8px 0px rgba(0,0,0,0.1)'
                    }}>
                        <p style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: '1.3', textTransform: 'uppercase' }}>
                            "ENOUGH! WE NEED A PLACE FOR THE WEIRDOS!"
                        </p>
                        <div style={{
                            content: '""',
                            position: 'absolute',
                            bottom: '-24px',
                            left: '40px',
                            width: '0',
                            height: '0',
                            borderLeft: '24px solid transparent',
                            borderRight: '24px solid transparent',
                            borderTop: '24px solid black',
                        }}></div>
                        <div style={{
                            content: '""',
                            position: 'absolute',
                            bottom: '-17px',
                            left: '44px',
                            width: '0',
                            height: '0',
                            borderLeft: '20px solid transparent',
                            borderRight: '20px solid transparent',
                            borderTop: '20px solid white',
                        }}></div>
                    </div>

                    <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>ENTER: HOBBYHUB</h2>
                    <p style={{ fontSize: '1.3rem', fontWeight: '500' }}>
                        A ragtag team of developers decided to fight back. They built a sanctuary.
                        No algorithms. Just communities based on pure, unadulterated PASSION.
                    </p>
                </div>
            </div>

            {/* PANEL 3: THE SQUAD (Features) */}
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                <h2 style={{ fontSize: '4rem', background: 'black', color: 'white', display: 'inline-block', padding: '15px 40px', transform: 'skew(-10deg)' }}>
                    CHOOSE YOUR WEAPON
                </h2>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '50px'
            }}>
                <ComicFeature
                    image="/img/Fitz - Football.png"
                    title="THE SPORT"
                    desc="For those who touch grass."
                    color="var(--accent-lime)"
                />
                <ComicFeature
                    image="/img/Nomads - Suitcase.png"
                    title="THE TRAVELER"
                    desc="For those escaping reality."
                    color="var(--accent-blue)"
                />
                <div className="comic-panel" style={{
                    background: 'var(--accent)',
                    border: '4px solid black',
                    padding: '30px',
                    boxShadow: '10px 10px 0px black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}>
                    <h3 style={{ fontSize: '2.5rem', color: 'white', textAlign: 'center', fontWeight: '800' }}>AND <br /> YOU.</h3>
                </div>
            </div>

            {/* CTA: TO BE CONTINUED */}
            <div className="comic-panel" style={{ marginTop: '120px', textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '40px', textTransform: 'uppercase' }}>
                    THE STORY CONTINUES WITH YOU...
                </p>
                <Link
                    to="/explore"
                    className="neo-btn"
                    style={{ fontSize: '2.5rem', padding: '25px 60px', border: '5px solid black', boxShadow: '12px 12px 0px black' }}
                    onClick={playButtonPress}
                >
                    JOIN THE SAGA
                </Link>
            </div>

        </div>
    );
};

const ComicFeature = ({ image, title, desc, color }) => (
    <div className="comic-panel" style={{
        background: 'white',
        border: '4px solid black',
        padding: '0',
        boxShadow: '10px 10px 0px black',
        transition: 'transform 0.2s',
        cursor: 'pointer',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    }}
        onClick={playButtonPress}
        onMouseEnter={e => gsap.to(e.currentTarget, { y: -10, boxShadow: '16px 16px 0px black' })}
        onMouseLeave={e => gsap.to(e.currentTarget, { y: 0, boxShadow: '10px 10px 0px black' })}
    >
        <div style={{
            height: '250px',
            background: color,
            borderBottom: '4px solid black',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden'
        }}>
            <img src={image} alt={title} style={{ width: '80%', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(5px 5px 0px black)' }} />
        </div>
        <div style={{ padding: '25px' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '10px' }}>{title}</h3>
            <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>{desc}</p>
        </div>
    </div>
);

export default About;
