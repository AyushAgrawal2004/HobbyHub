import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Volume2, VolumeX } from 'lucide-react';

const slides = [
    {
        title: "WARNING: SYSTEM CRITICAL",
        desc: "THE ALGORITHM IS WATCHING.",
        theme: "villain",
        bg: "#FF3333", // Red
        element: ".intro-controller"
    },
    {
        title: "YOU ARE TRAPPED IN THE LOOP.",
        desc: "Endless feeds. Dopamine hits. You are just a metric.",
        theme: "villain",
        bg: "#000000", // Dark
        element: ".intro-bg"
    },
    {
        title: "SIGNAL DETECTED...",
        desc: "A safe haven found.",
        theme: "hero",
        bg: "#2b2b2b", // Dark Grey overlay
        element: ".intro-tent"
    },
    {
        title: "WELCOME TO THE RESISTANCE.",
        desc: "No tracking. Just pure OBSESSION.",
        theme: "hero",
        bg: "var(--accent-lime)",
        element: ".intro-book"
    },
    {
        title: "CHOOSE YOUR COMMUNITY.",
        desc: "The Saga Begins Now.",
        theme: "hero",
        bg: "var(--accent)",
        element: ".intro-ball"
    }
];

const IntroAnimation = ({ onIntroComplete, isSplash = false }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [animationDone, setAnimationDone] = useState(false);

    // Audio State
    const audioRef = useRef(new Audio('/sounds/intro_music.mp3'));
    const [isMuted, setIsMuted] = useState(false);

    // Auto-scroll
    useEffect(() => {
        if (!isSplash) return;
        const timer = setInterval(() => {
            setCurrentSlide(prev => {
                if (prev < slides.length - 1) return prev + 1;
                clearInterval(timer);
                setAnimationDone(true);
                return prev;
            });
        }, 2800); // Slightly longer for dramatic reading
        return () => clearInterval(timer);
    }, [isSplash]);

    // Audio Logic
    useEffect(() => {
        if (!isSplash) return;
        const audio = audioRef.current;
        audio.volume = 0.4;
        audio.loop = true;
        audio.play().catch(e => console.log("Autoplay blocked"));
        return () => { audio.pause(); audio.currentTime = 0; };
    }, [isSplash]);

    const toggleMute = () => {
        const audio = audioRef.current;
        audio.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    // Main Animations
    useGSAP(() => {
        const tl = gsap.timeline();

        // 1. Initial Setup - Everything Hidden or Far Away
        tl.set('.intro-comic-overlay', { opacity: 0 })
            .set('.slide-text-container', { scale: 0, rotation: -10 });

        // Scene Elements Entrance
        tl.from('.intro-bg', { scale: 1.2, opacity: 0, duration: 1 })
            .from('.intro-tent', { y: 600, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.5')
            .from('.intro-controller', { y: -600, duration: 0.8, ease: 'power4.out' }, '-=0.6')
            .from('.intro-book', { x: -600, rotation: -90, duration: 1, ease: 'elastic.out(1, 0.7)' }, '-=0.6')
            .from('.intro-ball', { x: 600, rotation: 360, duration: 1, ease: 'bounce.out' }, '-=0.8');

        // Continuous Hover
        gsap.to(['.intro-tent', '.intro-controller', '.intro-book', '.intro-ball'], {
            y: '+=15', duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.3
        });

        // Mouse Parallax
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;
            const x = (e.clientX / window.innerWidth - 0.5) * 40;
            const y = (e.clientY / window.innerHeight - 0.5) * 40;
            gsap.to('.intro-bg', { x: x * 0.5, y: y * 0.5, duration: 1 });
            gsap.to('.intro-tent', { x: x, y: y, duration: 1 });
            gsap.to('.intro-controller', { x: x * 1.5, y: y * 1.5, duration: 1 });
            gsap.to('.intro-book', { x: x * 1.2, y: y * 1.2, duration: 1 });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);

    }, { scope: containerRef });

    // Per-Slide Dramatic Animations
    useGSAP(() => {
        const current = slides[currentSlide];
        const isVillain = current.theme === 'villain';

        // 1. Background overlay transition
        gsap.to('.intro-comic-overlay', {
            backgroundColor: current.bg,
            opacity: isVillain ? 0.9 : 0.7,
            duration: 0.5,
            ease: 'power2.inOut'
        });

        // 2. Text Reveal (Punchy comic style)
        gsap.fromTo('.slide-text-container',
            { scale: 0.5, opacity: 0, rotation: isVillain ? -5 : 5 },
            { scale: 1, opacity: 1, rotation: isVillain ? 2 : -2, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
        );

        // 3. Specific Element Highlight (Spotlight effect)
        gsap.to('.intro-element', { filter: 'brightness(0.5) blur(2px)', scale: 1, duration: 0.5 }); // Reset all
        gsap.to(current.element, {
            filter: 'brightness(1.2) drop-shadow(0 0 20px white)',
            scale: 1.2,
            duration: 0.5,
            ease: 'back.out(2)'
        });

        // 4. Camera Shake for Villain Slides
        if (isVillain) {
            gsap.to(containerRef.current, { x: 5, y: 5, duration: 0.1, yoyo: true, repeat: 10, ease: 'rough' });

            // Special Doomscrolling Chaos (Slide 1)
            if (currentSlide === 1) {
                gsap.to('.intro-bg', {
                    scale: 1.5, duration: 0.1, repeat: 10, yoyo: true, ease: 'steps(2)'
                });
                gsap.to('.slide-text-container', {
                    skewX: 10, rotation: Math.random() * 10, duration: 0.1, repeat: 5, yoyo: true
                });
            }
        }

    }, [currentSlide]);

    return (
        <div ref={containerRef} style={{
            position: isSplash ? 'fixed' : 'absolute',
            top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden',
            zIndex: isSplash ? 9999 : 0, background: 'black', margin: 0, padding: 0
        }}>
            {/* Color Overlay for Mood */}
            <div className="intro-comic-overlay" style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                zIndex: 2, pointerEvents: 'none', mixBlendMode: 'hard-light'
            }} />

            {/* Background Image */}
            <img src="/intro imgs/background.png" className="intro-bg intro-element" alt="Bg"
                style={{ position: 'absolute', top: '-5%', left: '-5%', width: '110%', height: '110%', objectFit: 'cover', zIndex: 1 }} />

            {/* Elements Layer */}
            <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 3, pointerEvents: 'none' }}>
                <img src="/intro imgs/tent.png" className="intro-tent intro-element" alt="Tent"
                    style={{ position: 'absolute', bottom: '15%', left: '10%', width: '25vw', maxWidth: '300px' }} />
                <img src="/intro imgs/controller.png" className="intro-controller intro-element" alt="AG"
                    style={{ position: 'absolute', top: '15%', right: '10%', width: '20vw', maxWidth: '250px' }} />
                <img src="/intro imgs/Hands - Book.png" className="intro-book intro-element" alt="Book"
                    style={{ position: 'absolute', bottom: '20%', right: '20%', width: '22vw', maxWidth: '280px' }} />
                <img src="/intro imgs/ball.png" className="intro-ball intro-element" alt="Ball"
                    style={{ position: 'absolute', top: '30%', left: '30%', width: '12vw', maxWidth: '150px' }} />
            </div>

            {/* UI Layer (Text & Controls) */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}>

                {/* Mute & Skip Controls */}
                {isSplash && (
                    <div style={{ position: 'absolute', top: '30px', right: '30px', display: 'flex', gap: '20px', pointerEvents: 'auto' }}>
                        <button onClick={toggleMute} style={{
                            background: 'white', border: '3px solid black', padding: '12px', cursor: 'pointer',
                            boxShadow: '6px 6px 0px black', display: 'flex'
                        }}>
                            {isMuted ? <VolumeX /> : <Volume2 />}
                        </button>
                    </div>
                )}

                {/* Main Comic Text Box */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '100%', maxWidth: '800px', textAlign: 'center', pointerEvents: 'none'
                }}>
                    <div className="slide-text-container" style={{
                        background: slides[currentSlide].theme === 'villain' ? 'var(--error)' : 'white',
                        padding: '40px',
                        border: '5px solid black',
                        boxShadow: '15px 15px 0px black',
                        display: 'inline-block',
                        transform: 'rotate(-2deg)'
                    }}>
                        <h1 style={{
                            fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            fontWeight: '800', textTransform: 'uppercase', lineHeight: 0.9,
                            color: slides[currentSlide].theme === 'villain' ? 'white' : 'black',
                            marginBottom: '20px',
                            textShadow: slides[currentSlide].theme === 'villain' ? '4px 4px 0px black' : 'none'
                        }}>
                            {slides[currentSlide].title}
                        </h1>
                        <p style={{
                            fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 'bold',
                            color: slides[currentSlide].theme === 'villain' ? 'black' : 'var(--text-secondary)',
                            background: slides[currentSlide].theme === 'villain' ? 'white' : 'transparent',
                            padding: '5px 10px', display: 'inline-block'
                        }}>
                            {slides[currentSlide].desc}
                        </p>
                    </div>

                    {/* Enter Button (Finale) */}
                    {isSplash && (currentSlide === slides.length - 1 || animationDone) && (
                        <div style={{ marginTop: '50px', pointerEvents: 'auto' }}>
                            <button onClick={onIntroComplete} className="neo-btn" style={{
                                fontSize: '2rem', padding: '20px 60px',
                                border: '5px solid black', boxShadow: '10px 10px 0px white',
                                background: 'black', color: 'white'
                            }}>
                                UNLEASH YOUR POWER →
                            </button>
                        </div>
                    )}
                </div>

                {/* Progress Bar (Comic Style) */}
                <div style={{
                    position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', gap: '15px'
                }}>
                    {slides.map((s, i) => (
                        <div key={i} style={{
                            width: '40px', height: '10px', border: '2px solid black',
                            background: i === currentSlide ? (s.theme === 'villain' ? 'var(--error)' : 'var(--accent)') : 'white',
                            transform: i === currentSlide ? 'scale(1.2)' : 'scale(1)',
                            transition: 'all 0.3s'
                        }} />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default IntroAnimation;
