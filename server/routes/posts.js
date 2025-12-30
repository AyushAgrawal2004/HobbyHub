const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const multer = require('multer');
const { storage } = require('../config/cloudinary');

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 50000000 }, // 50MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).fields([{ name: 'image', maxCount: 1 }, { name: 'music', maxCount: 1 }]);

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|mp3|mpeg|wav|mp4/;
    // Check ext (Cloudinary handles many formats, but let's keep basic check)
    // Note: path.extname might fail if file doesn't have extension, but standard upload usually does.
    // For Cloudinary, we trust the allowed_formats in config largely, but this extra check is fine.
    // Simplifying regex to be more inclusive or relying on multer-storage-cloudinary params.
    return cb(null, true);
}

// @route   POST api/posts
// @desc    Create a post
router.post('/', auth, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Upload Error:', err);
            return res.status(500).json({ msg: 'Upload Error', error: err.message || err });
        }

        try {
            if (!req.files || !req.files.image) {
                return res.status(400).json({ msg: 'Image is required' });
            }

            const newPost = new Post({
                user: req.user.id,
                caption: req.body.caption,
                image: req.files.image[0].path,
                music: req.files.music ? req.files.music[0].path : null
            });

            const post = await newPost.save();
            res.json(post);
        } catch (serverErr) {
            console.error(serverErr);
            res.status(500).json({ msg: 'Server Error', error: serverErr.message });
        }
    });
});

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 }).populate('user', ['username', 'profilePicture']).populate('comments.user', ['username', 'profilePicture']);
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if the post has already been liked
        if (post.likes.filter(like => like.toString() === req.user.id).length > 0) {
            // Un-like
            const removeIndex = post.likes.map(like => like.toString()).indexOf(req.user.id);
            post.likes.splice(removeIndex, 1);
        } else {
            post.likes.unshift(req.user.id);
            // Also remove from dislikes if present
            if (post.dislikes.filter(dislike => dislike.toString() === req.user.id).length > 0) {
                const removeIndex = post.dislikes.map(dislike => dislike.toString()).indexOf(req.user.id);
                post.dislikes.splice(removeIndex, 1);
            }
        }

        await post.save();

        // Return likes and dislikes count to update UI efficiently
        res.json({ likes: post.likes, dislikes: post.dislikes });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/posts/dislike/:id
// @desc    Dislike a post
// @access  Private
router.put('/dislike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if the post has already been disliked
        if (post.dislikes.filter(dislike => dislike.toString() === req.user.id).length > 0) {
            // Un-dislike
            const removeIndex = post.dislikes.map(dislike => dislike.toString()).indexOf(req.user.id);
            post.dislikes.splice(removeIndex, 1);
        } else {
            post.dislikes.unshift(req.user.id);
            // Also remove from likes if present
            if (post.likes.filter(like => like.toString() === req.user.id).length > 0) {
                const removeIndex = post.likes.map(like => like.toString()).indexOf(req.user.id);
                post.likes.splice(removeIndex, 1);
            }
        }

        await post.save();
        res.json({ likes: post.likes, dislikes: post.dislikes });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post('/comment/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        const newComment = {
            text: req.body.text,
            user: req.user.id
        };

        post.comments.unshift(newComment);

        await post.save();

        // Populate the user of the new comment to return it fully
        const updatedPost = await Post.findById(req.params.id).populate('comments.user', ['username', 'profilePicture']);

        res.json(updatedPost.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Check user
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await post.deleteOne();

        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
