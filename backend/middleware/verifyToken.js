// middleware/verifyToken.js
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Додаємо дані користувача (id, role) до об'єкта запиту
        next(); // Передаємо управління далі
    } catch (error) {
        res.status(403).json({ message: 'Invalid token.' });
    }
}

module.exports = verifyToken;