const db = require('../config/db');

exports.getAllGenres = async (req, res) => {
    const [genres] = await db.query('SELECT * FROM genre ORDER BY name');
    res.json(genres);
};

exports.addGenre = async (req, res) => {
    const { name } = req.body;
    const [result] = await db.execute('INSERT INTO genre (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
};

exports.updateGenre = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    await db.execute('UPDATE genre SET name = ? WHERE id = ?', [name, id]);
    res.json({ message: 'Genre updated' });
};

exports.deleteGenre = async (req, res) => {
    const { id } = req.params;
    await db.execute('DELETE FROM genre WHERE id = ?', [id]);
    res.json({ message: 'Genre deleted' });
};