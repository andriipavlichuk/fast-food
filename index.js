require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool } = require('pg');
const { Resend } = require('resend');
const crypto = require('crypto');

// Setup
const app = express();
const PORT =  process.env.PORT || 3000;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cookieParser());
app.use(bodyParser.json());

// Generate a token for a user
function generateToken() {
    return crypto.randomBytes(32).toString('hex'); // Generates a 64-character token
}

// Function to hash a token using SHA-256
function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

// Function to encrypt data using AES-256-CBC
function encryptData(data, key) {
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`; // Store IV with the encrypted data
}

// Function to decrypt data using AES-256-CBC
function decryptData(encryptedData, key) {
    const [iv, encrypted] = encryptedData.split(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Get path to the page
function getPath(name) {
    return path.join(__dirname, 'pages', `${name}.html`);
}

// Middleware to assign a token automatically
app.use((req, res, next) => {
    if (!req.cookies?.auth_token) {
        const token = generateToken();

        res.cookie('auth_token', token, {
            httpOnly: true, // Secure the cookie
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
    }
    next();
});

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

app.get('/api/orders', async (req, res) => {
    const receiverToken = req.cookies?.auth_token; // Retrieve token from cookies
    if (!receiverToken) {
        return res.status(400).json({ error: 'Missing receiver token' });
    }

    try {
        // Hash the token
        const hashedToken = hashToken(receiverToken);

        // Parse the ids parameter if provided
        const ids = req.query.ids ? req.query.ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : null;

        // Query the database for orders associated with the hashed token and optional ids
        const query = `
            SELECT id, items, delivery, comment,
                   EXTRACT(EPOCH FROM placed_at) * 1000 AS placed_at,
                   receiver_name, receiver_email, receiver_address, l4d
            FROM orders
            WHERE receiver_token = $1
            ${ids ? `AND id = ANY($2::int[])` : ''}
            ORDER BY placed_at DESC
        `;
        const values = ids ? [hashedToken, ids] : [hashedToken];
        const result = await pool.query(query, values);

        // Decrypt the receiver_name and receiver_address fields
        const encryptionKey = process.env.ENCRYPTION_KEY;
        const orders = result.rows.map(order => ({
            ...order,
            receiver_name: decryptData(order.receiver_name, encryptionKey),
            receiver_address: decryptData(order.receiver_address, encryptionKey),
        }));

        // Return the orders
        res.status(200).json(orders);
    } catch (err) {
        console.error('Error retrieving orders:', err);
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
});

// Handlers
app.post('/handlers/send-email', async (req, res) => {
    res.status(200).json(req.headers);

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

app.post('/handlers/add-order', async (req, res) => {
    const {
        name, address, email, comment, column,
        delivery, items, placed
    } = req.body;

    const receiverToken = req.cookies?.auth_token; // Retrieve token from cookies
    if (!receiverToken) {
        return res.status(400).json({ error: 'Missing receiver token' });
    }

    try {
        // Hash the token
        const hashedToken = hashToken(receiverToken);

        // Encrypt name and address
        const encryptionKey = process.env.ENCRYPTION_KEY;
        const encryptedName = encryptData(name, encryptionKey);
        const encryptedAddress = encryptData(address, encryptionKey);

        const query = `
            INSERT INTO orders (
                items, delivery, comment, placed_at, receiver_token, 
                receiver_name, receiver_email, receiver_address, l4d
            ) VALUES ($1, $2, $3, to_timestamp($4 / 1000.0) AT TIME ZONE 'UTC', $5, $6, $7, $8, $9)
            RETURNING id
        `;

        const values = [
            JSON.stringify(items), delivery, comment || null, placed,
            hashedToken, encryptedName, email, encryptedAddress, column
        ];

        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Order added successfully', orderId: result.rows[0].id });
    } catch (err) {
        console.error('Error inserting order:', err);
        res.status(500).json({ error: 'Failed to add order' });
    }
})

// 404 page
app.use(function (req, res, next) {
    res.status(404).sendFile(path.join(__dirname + '/404/index.html'));
});

// Server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
