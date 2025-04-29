const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Get path to the page
function getPath(name) {
    return path.join(__dirname, 'pages', `${name}.html`);
}

// App static files (publicly available)
app.use(express.static('public'));

// Pages
["/", "/about", "/catalog", "/contact", "/cart", "/account", "/reviews", "/place_order", "/order"].forEach(route => {
    app.get(route, (req, res) => {
        const pageName = route === '/' ? 'index' : route.slice(1);
        res.sendFile(getPath(pageName));
    })
})

app.use(function (req, res, next) {
    res.status(404).sendFile(path.join(__dirname + '/404/index.html'));
});

// API routes
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
