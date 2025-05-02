require('dotenv').config();

const express = require('express');
const path = require('path');
const { Pool } = require('pg');

// Setup
const app = express();
const PORT =  process.env.PORT || 3000;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Get path to the page
function getPath(name) {
    return path.join(__dirname, 'pages', `${name}.html`);
}

// App static files (publicly available)
app.use(express.static(path.join(__dirname, 'public')));

// Pages
["/", "/about", "/catalog", "/contact", "/cart", "/account", "/reviews", "/place_order", "/order"].forEach(route => {
    app.get(route, (req, res) => {
        const pageName = route === '/' ? 'index' : route.slice(1);
        res.sendFile(getPath(pageName));
    })
})

// API routes
app.get('/api/catalog', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || -1;
        const query = `SELECT * FROM catalog ORDER BY id`;
        const result = await pool.query(limit > 0 ? query + ` LIMIT ${limit}` : query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/api/reviews', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || -1;
        const query = `SELECT * FROM reviews ORDER BY id`;
        const result = await pool.query(limit > 0 ? query + ` LIMIT ${limit}` : query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/api/items', async (req, res) => {
    try {
        const ids = req.query.ids || ""; // Expecting a comma-separated list of IDs, e.g., "1,2,3"
        if (!ids) {
            return res.status(400).json({ error: 'No IDs provided' });
        }

        const idList = ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        if (idList.length === 0) {
            return res.status(400).json({ error: 'Invalid IDs provided' });
        }

        const query = `SELECT * FROM catalog WHERE id = ANY($1::int[]) ORDER BY id`;
        const result = await pool.query(query, [idList]);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 404 page
app.use(function (req, res, next) {
    res.status(404).sendFile(path.join(__dirname + '/404/index.html'));
});

// Server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
