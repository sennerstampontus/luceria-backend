import express from 'express';
import cors from 'cors';
import axios from 'axios';
const app = express();
const port = 3030;
const allowedOrigins = ['http://localhost:3000'];
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    if (allowedOrigins.includes(req.headers['access-control-allow-origin'] || '')) {
        // Enable CORS for this request
        corsOptions = { origin: true, optionsSuccessStatus: 200 };
    }
    else {
        // Disable CORS for this request
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};
app.use(cors(corsOptionsDelegate));
app.get('/contentful-content', async (req, res) => {
    const { content } = req.query;
    if (!content)
        res.send('query parameter is missing');
    const result = await axios.get(`${process.env.API_BASE_URL}/spaces/${process.env.CONTENTFUL_SPACE_ID}/content_types/${content}?access_token=${process.env.API_KEY}`);
    console.log(result.data.fields);
    if (!result)
        res.send('Error');
    res.send('contactForm');
});
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});
app.listen(port, () => {
    console.log(`Express is listening at http://localhost:${port}`);
});
