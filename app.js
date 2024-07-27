const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));

// Route for the bio page
app.get('/', (req, res) => {
    res.render('index', {
        name: 'Keiran',
        description: 'i make things',
        image: 'http://kuuichi.xyz/files/1230319937155760131/2nk0wou5d1ba.gif'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

