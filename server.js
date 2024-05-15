// this file contains objects for 
// the client to connect to postgresql db
// and app for running the server

import express from 'express';
import truemates from './requirements/requirements.route.js';

const app = express();

// no front-end hosted on different domain is calling thigns from here
// app.use(cors());

// in case there will be any requests with JSON payloads
app.use(express.json());
app.use('/api/v1/truemates', truemates);
app.use('*', (req, res) => {
    res.status(404).json({
        err: 'not found'
    });
})

export default app;
