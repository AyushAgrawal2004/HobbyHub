import { useState } from 'react';
import { X, Image, Music, Upload } from 'lucide-react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { playButtonPress } from '../utils/audio';

const CreatePostModal = ({ onClose, onPostCreated }) => {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [music, setMusic] = useState(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleMusicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMusic(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        playButtonPress();
        if (!image) return alert('Please select an image');

        setLoading(true);
        const formData = new FormData();
        formData.append('image', image);
        if (music) formData.append('music', music);
        formData.append('caption', caption);

        try {
            const res = await api.post('/posts', formData);
            onPostCreated(res.data);
            onClose();
        } catch (err) {
            console.error(err);
            alert('Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(255,255,255,0.8)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(5px)'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="neo-card"
                style={{ width: '95%', maxWidth: '550px', padding: '40px', position: 'relative', border: '3px solid black', boxShadow: '12px 12px 0px 0px black' }}
            >
                <button onClick={() => { playButtonPress(); onClose(); }} style={{ position: 'absolute', top: '15px', right: '15px', background: 'black', color: 'white', border: 'none', cursor: 'pointer', padding: '5px' }}>
                    <X size={24} />
                </button>

                <h2 style={{ marginBottom: '30px', textAlign: 'center', fontSize: '3rem', lineHeight: 0.9, wordBreak: 'break-word' }}>
                    CREATE <br />
                    <span style={{ color: 'var(--accent)', background: 'black', padding: '0 10px' }}>NEW POST</span>
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Image Upload */}
                    <div style={{ marginBottom: '25px' }}>
                        <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                        <label
                            htmlFor="image-upload"
                            onClick={playButtonPress}
                            style={{
                                display: 'block',
                                width: '100%',
                                height: '250px',
                                border: '3px solid black',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                background: preview ? `url(${preview}) center/cover no-repeat` : '#ffffff',
                                boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.1)'
                            }}
                        >
                            {!preview && (
                                <>
                                    <Image size={50} style={{ marginBottom: '15px', color: 'black' }} />
                                    <span style={{ color: 'black', fontWeight: 'bold', textTransform: 'uppercase' }}>Click to upload image</span>
                                </>
                            )}
                        </label>
                    </div>

                    {/* Music Upload */}
                    <div style={{ marginBottom: '25px' }}>
                        <input
                            type="file"
                            id="music-upload"
                            accept="audio/*"
                            onChange={handleMusicChange}
                            style={{ display: 'none' }}
                        />
                        <label
                            htmlFor="music-upload"
                            className="neo-btn neo-btn-secondary"
                            onClick={playButtonPress}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', border: '2px solid black', cursor: 'pointer' }}
                        >
                            <Music size={20} />
                            <span style={{ fontWeight: 'bold' }}>{music ? music.name : 'ADD BACKGROUND MUSIC (OPTIONAL)'}</span>
                        </label>
                    </div>

                    <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="WRITE A CAPTION..."
                        className="neo-input"
                        style={{
                            width: '100%',
                            padding: '15px',
                            minHeight: '120px',
                            marginBottom: '30px',
                            resize: 'none',
                            color: 'black',
                            border: '3px solid black',
                            fontSize: '1.2rem'
                        }}
                    />

                    <button
                        type="submit"
                        className="neo-btn"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.2rem', padding: '15px', background: 'black', color: 'var(--accent-lime)' }}
                        disabled={loading}
                    >
                        {loading ? 'UPLOADING...' : <><Upload size={24} /> <span style={{ fontWeight: '800' }}>SHARE POST</span></>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default CreatePostModal;
