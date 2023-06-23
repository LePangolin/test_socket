const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.sendFile('index.html', { root: './public/html' });
});

router.get('/3d', (req, res, next) => {
    res.sendFile('three.html', { root: './public/html' });
});

router.get('/blackboard', (req, res, next) => {
    res.sendFile('blackboard.html', { root: './public/html' });
});

router.get('/voiture', (req, res, next) => {
    res.sendFile('voiture.html', { root: './public/html' });
});

module.exports = router;