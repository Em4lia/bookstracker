// middleware/isAdmin.js
function isAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin resource. Access denied.' });
    }
    next();
}

module.exports = isAdmin;