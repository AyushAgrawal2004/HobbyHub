const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Registration = require('../models/Registration');
const Contest = require('../models/Contest');
const User = require('../models/User');

// @route   POST api/registrations
// @desc    Register for a contest
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { contestId, type, members } = req.body;

        // Check if contest exists
        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(404).json({ msg: 'Contest not found' });
        }

        // Check if already registered
        const existingReg = await Registration.findOne({ contest: contestId, user: req.user.id });
        if (existingReg) {
            return res.status(400).json({ msg: 'You have already registered for this contest' });
        }

        const newRegistration = new Registration({
            contest: contestId,
            user: req.user.id,
            type,
            members
        });

        await newRegistration.save();

        // Increment participant count
        contest.participants += members.length; // Count actual people, or just 1 per registration? 
        // User's prompt implies "Registered Users". If it's a group, maybe count members.
        // Let's count registrations for now, or total members. Dashboard shows "Participants".
        // Let's stick to total members for "Participants".

        // Wait, current logic in Dashboard just shows `contest.participants`. 
        // If I update it here, it will persist.
        // But if I delete a registration, I should decrement. (Delete not essential yet).

        await contest.save();

        res.json(newRegistration);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/registrations/my
// @desc    Get all registrations for current user
// @access  Private
router.get('/my', auth, async (req, res) => {
    try {
        const registrations = await Registration.find({ user: req.user.id });
        res.json(registrations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/registrations/contest/:contestId
// @desc    Get all registrations for a contest (Admin only)
// @access  Private
router.get('/contest/:contestId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const registrations = await Registration.find({ contest: req.params.contestId })
            .populate('user', ['name', 'email'])
            .sort({ createdAt: -1 });

        res.json(registrations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
