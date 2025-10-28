const db = require('../config/db');

exports.getAllAuthors = async (req, res) => {
    const [authors] = await db.query('SELECT * FROM author ORDER BY name');
    res.json(authors);
};

exports.addAuthor = async (req, res) => {
    const { name } = req.body;
    const [result] = await db.execute('INSERT INTO author (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
};

exports.updateAuthor = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    await db.execute('UPDATE author SET name = ? WHERE id = ?', [name, id]);
    res.json({ message: 'Author updated' });
};

exports.deleteAuthor = async (req, res) => {
    // TODO:  перевірка, чи не прив'язаний автор до книг
    const { id } = req.params;
    await db.execute('DELETE FROM author WHERE id = ?', [id]);
    res.json({ message: 'Author deleted' });
};