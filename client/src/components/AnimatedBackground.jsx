import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const AnimatedBackground = () => {
    const containerRef = useRef();
    const cursorRef = useRef();

    useGSAP(() => {
        // Floating Blobs Animation
        const blobs = gsap.utils.toArray('.bg-blob');

        blobs.forEach((blob) => {
            gsap.to(blob, {
                x: 'random(-150, 150)',
                y: 'random(-150, 150)',
                scale: 'random(0.8, 1.4)',
                rotation: 'random(0, 360)',
                duration: 'random(15, 25)',
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });
        });

    }, { scope: containerRef });

    // Mouse Follow Effect
    useEffect(() => {
        const moveCursor = (e) => {
            gsap.to(cursorRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.8,
                ease: 'power2.out'
            });
        };
        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                overflow: 'hidden',
                background: 'var(--bg-primary)' // Raw Concrete Grey
            }}
        >
            {/* Grid Overlay for 3D Technical Feel */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'linear-gradient(black 1px, transparent 1px), linear-gradient(90deg, black 1px, transparent 1px)',
                backgroundSize: '100px 100px',
                opacity: 0.05,
                zIndex: 0,
                pointerEvents: 'none'
            }}></div>

            {/* Noise Texture Overlay */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0.15,
                    pointerEvents: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    zIndex: 2
                }}
            />

            {/* Mouse Spotlight */}
            <div
                ref={cursorRef}
                style={{
                    position: 'absolute',
                    top: -250,
                    left: -250,
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, var(--accent-lime), transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 1,
                    mixBlendMode: 'overlay',
                    opacity: 0.4
                }}
            />

            {/* Deep Dynamic Background Blobs */}
            <div className="bg-blob" style={{
                position: 'absolute',
                top: '10%',
                left: '20%',
                width: '50vw',
                height: '50vw',
                background: 'var(--accent)',
                borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
                filter: 'blur(100px)',
                opacity: 0.15,
                zIndex: 0
            }} />

            <div className="bg-blob" style={{
                position: 'absolute',
                bottom: '10%',
                right: '10%',
                width: '60vw',
                height: '60vw',
                background: 'var(--accent-blue)',
                borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                filter: 'blur(120px)',
                opacity: 0.15,
                zIndex: 0
            }} />

            <div className="bg-blob" style={{
                position: 'absolute',
                top: '40%',
                right: '40%',
                width: '40vw',
                height: '40vw',
                background: 'var(--accent-lime)',
                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                filter: 'blur(90px)',
                opacity: 0.15,
                zIndex: 0
            }} />
        </div>
    );
};

export default AnimatedBackground;
