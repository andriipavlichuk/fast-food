require('dotenv').config();

const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const { Resend } = require('resend');

// Setup
const app = express();
const PORT =  process.env.PORT || 3000;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const resend = new Resend(process.env.RESEND_API_KEY);

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

// Handlers
app.post('/api/send-email', async (req, res) => {
    res.status(500).json(req.headers);

    // try {
    //     const result = await resend.emails.send({
    //         from: `Fast Food Customer Service <customer-service@${process.env.DOMAIN}>`,
    //         to: '',
    //         subject: 'Отримання листа',
    //         text: 'Ура! Ми отримали ваш лист!',
    //     });
    //
    //     res.status(200).json(result);
    // } catch (error) {
    //     res.status(500).json(error);
    // }
});

// 404 page
app.use(function (req, res, next) {
    res.status(404).sendFile(path.join(__dirname + '/404/index.html'));
});

// Server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
