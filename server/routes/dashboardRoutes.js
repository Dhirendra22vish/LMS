const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, async (req, res) => {
    try {
        const totalBooks = await Book.countDocuments();
        const totalMembers = await User.countDocuments({ role: { $ne: 'admin' } }); // Exclude admins
        const issuedBooks = await Transaction.countDocuments({ status: 'issued' });

        // Calculate returned today (optional)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const returnedToday = await Transaction.countDocuments({
            status: 'returned',
            returnDate: { $gte: startOfDay }
        });

        res.json({
            totalBooks,
            totalMembers,
            issuedBooks,
            returnedToday
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
