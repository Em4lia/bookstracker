const db = require('../config/db');

exports.getAllUsers = async (req, res) => {
    const [users] = await db.query("SELECT id, username, role, created_at, is_blocked FROM user");
    res.json(users);
};

exports.toggleUserBlock = async (req, res) => {
    try {
        const { userId } = req.params;
        const query = 'UPDATE user SET is_blocked = NOT is_blocked WHERE id = ?';
        await db.execute(query, [userId]);
        res.json({ message: "User's block status has been toggled." });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const { bookId, userId } = req.params;
        const query = 'UPDATE userbookinteraction SET comment = NULL, rating = NULL WHERE book_id = ? AND user_id = ?';
        const [result] = await db.execute(query, [bookId, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        res.json({ message: 'Review deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};