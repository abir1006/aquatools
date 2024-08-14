const express = require('express');
const path = require('path');
const serialize = require('serialize-javascript');
const app = express(), port = 80;

const env = process.env;

app.use(express.static(path.join(__dirname, '../build')));

app.get('/env.js', function (req, res) {
    res.set('Content-Type', 'application/javascript');
    res.send('var env = ' + serialize(env));
});

app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});