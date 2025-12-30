import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, ThumbsDown, Music, Volume2, VolumeX, Trash2 } from 'lucide-react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { playButtonPress } from '../utils/audio';

const PostCard = ({ post, user, onDelete }) => {
    const [likes, setLikes] = useState(post.likes);
    const [dislikes, setDislikes] = useState(post.dislikes);
    const [comments, setComments] = useState(post.comments || []);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const audioRef = useRef(null);

    const isLiked = likes.includes(user._id);
    const isDisliked = dislikes.includes(user._id);

    const handleLike = async () => {
        playButtonPress();
        try {
            const res = await api.put(`/posts/like/${post._id}`);
            setLikes(res.data.likes);
            setDislikes(res.data.dislikes);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDislike = async () => {
        playButtonPress();
        try {
            const res = await api.put(`/posts/dislike/${post._id}`);
            setLikes(res.data.likes);
            setDislikes(res.data.dislikes);
        } catch (err) {
            console.error(err);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        playButtonPress();
        if (!newComment.trim()) return;

        try {
            const res = await api.post(`/posts/comment/${post._id}`, { text: newComment });
            setComments(res.data);
            setNewComment('');
        } catch (err) {
            console.error(err);
        }
    };

    const togglePlay = () => {
        playButtonPress();
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        playButtonPress();
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="neo-card"
            style={{ marginBottom: '40px', overflow: 'hidden', padding: 0, border: '3px solid black', boxShadow: '8px 8px 0px 0px black' }}
        >
            {/* Header */}
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px solid black', background: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '50px', height: '50px', background: 'var(--accent-lime)', border: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: '800', overflow: 'hidden' }}>
                        {post.user.profilePicture ? (
                            <img src={post.user.profilePicture.startsWith('http') ? post.user.profilePicture : `${import.meta.env.VITE_API_URL}${post.user.profilePicture}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            post.user.username[0].toUpperCase()
                        )}
                    </div>
                    <div>
                        <h4 style={{ margin: 0, fontSize: '1.4rem', lineHeight: 1 }}>{post.user.username}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'black', fontWeight: 'bold' }}>
                            {new Date(post.createdAt).toLocaleDateString().toUpperCase()}
                        </span>
                    </div>
                </div>
                {user._id === post.user._id && (
                    <button onClick={() => { playButtonPress(); onDelete(post._id); }} style={{ background: 'var(--error)', border: '2px solid black', color: 'white', cursor: 'pointer', padding: '5px', boxShadow: '2px 2px 0px black' }}>
                        <Trash2 size={20} />
                    </button>
                )}
            </div>

            {/* Image */}
            <div style={{ position: 'relative', borderBottom: '3px solid black' }}>
                <img
                    src={post.image.startsWith('http') ? post.image : `${import.meta.env.VITE_API_URL}${post.image}`}
                    alt="Post"
                    style={{ width: '100%', maxHeight: '600px', objectFit: 'cover', filter: 'grayscale(0%) contrast(1.1)' }}
                />

                {/* Music Controls Overlay */}
                {post.music && (
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        right: '20px',
                        background: 'black',
                        padding: '10px 15px',
                        border: '2px solid var(--accent-lime)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        boxShadow: '4px 4px 0px 0px var(--accent-lime)'
                    }}>
                        <audio ref={audioRef} src={post.music.startsWith('http') ? post.music : `${import.meta.env.VITE_API_URL}${post.music}`} loop />
                        <button onClick={togglePlay} style={{ background: 'none', border: 'none', color: 'var(--accent-lime)', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <Music size={24} className={isPlaying ? 'spin-animation' : ''} />
                        </button>
                        <button onClick={toggleMute} style={{ background: 'none', border: 'none', color: 'var(--accent-lime)', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                        </button>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div style={{ padding: '20px', background: 'white' }}>
                {/* Caption */}
                <div style={{ marginBottom: '20px', fontSize: '1.2rem', fontFamily: 'Space Grotesk' }}>
                    <span style={{ fontWeight: '800', marginRight: '10px', textTransform: 'uppercase' }}>{post.user.username}:</span>
                    {post.caption}
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', borderTop: '2px solid black', paddingTop: '20px' }}>
                    <button onClick={handleLike} className="neo-btn" style={{ padding: '10px 20px', display: 'flex', gap: '8px', alignItems: 'center', background: isLiked ? 'var(--accent)' : 'white' }}>
                        <Heart size={24} fill={isLiked ? 'black' : 'none'} color="black" />
                        <span style={{ fontWeight: 'bold' }}>{likes.length}</span>
                    </button>
                    <button onClick={handleDislike} className="neo-btn" style={{ padding: '10px 20px', display: 'flex', gap: '8px', alignItems: 'center', background: isDisliked ? 'black' : 'white', color: isDisliked ? 'white' : 'black' }}>
                        <ThumbsDown size={24} />
                        <span style={{ fontWeight: 'bold' }}>{dislikes.length}</span>
                    </button>
                    <button onClick={() => { playButtonPress(); setShowComments(!showComments); }} className="neo-btn" style={{ padding: '10px 20px', display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--accent-lime)' }}>
                        <MessageCircle size={24} color="black" />
                        <span style={{ fontWeight: 'bold' }}>{comments.length}</span>
                    </button>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                    {showComments && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden', borderTop: '2px solid black', paddingTop: '20px' }}
                        >
                            <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '20px', paddingRight: '5px' }}>
                                {comments.map((comment, index) => (
                                    <div key={index} style={{ marginBottom: '12px', fontSize: '1rem', padding: '10px', background: '#f5f5f5', border: '2px solid black' }}>
                                        <span style={{ fontWeight: '800', marginRight: '8px', textTransform: 'uppercase' }}>
                                            {comment.user ? comment.user.username : 'User'}
                                        </span>
                                        <span>{comment.text}</span>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleComment} style={{ display: 'flex', gap: '15px' }}>
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="TYPE COMMENT..."
                                    className="neo-input"
                                    style={{ flex: 1, border: '3px solid black' }}
                                />
                                <button type="submit" className="neo-btn" style={{ border: '3px solid black' }}>SEND</button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );

};

export default PostCard;
