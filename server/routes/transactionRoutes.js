const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const { protect, admin } = require('../middleware/authMiddleware');

// Issue Book
router.post('/issue', protect, admin, async (req, res) => {
    try {
        const { bookId, memberId, dueDate } = req.body;

        // Check if book available
        const book = await Book.findById(bookId);
        if (!book || book.quantity <= 0) {
            return res.status(400).json({ message: 'Book not available' });
        }

        const transaction = new Transaction({
            book: bookId,
            member: memberId,
            dueDate,
            issuedBy: req.user._id
        });

        await transaction.save();

        // Decrease quantity
        book.quantity -= 1;
        await book.save();

        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Return Book
router.put('/return/:id', protect, admin, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction || transaction.status === 'returned') {
            return res.status(400).json({ message: 'Invalid transaction' });
        }

        transaction.returnDate = Date.now();
        transaction.status = 'returned';

        // Calculate fine (basic logic: 10 units per day late)
        const dueDate = new Date(transaction.dueDate);
        const returnDate = new Date(transaction.returnDate);
        // Reset hours to ensure fair day calculation
        dueDate.setHours(0, 0, 0, 0);
        returnDate.setHours(0, 0, 0, 0);

        if (returnDate > dueDate) {
            const diffTime = Math.abs(returnDate - dueDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            transaction.fine = diffDays * 10;
        }

        await transaction.save();

        // Increase quantity
        const book = await Book.findById(transaction.book);
        book.quantity += 1;
        await book.save();

        res.json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all transactions
router.get('/', protect, admin, async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('book', 'title')
            .populate('member', 'name email');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user history
router.get('/my-history', protect, async (req, res) => {
    try {
        const transactions = await Transaction.find({ member: req.user._id })
            .populate('book', 'title');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
