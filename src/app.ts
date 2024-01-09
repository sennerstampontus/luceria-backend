import express from 'express';
import cors, { CorsRequest, CorsOptions } from 'cors';
import axios from 'axios';
import { Content } from './types/content.js';

const app = express();
const port = 3030;

const allowedOrigins = ['http://localhost:3000'];

const corsOptionsDelegate = (
  req: CorsRequest,
  callback: (err: Error | null, options?: CorsOptions) => void
) => {
  let corsOptions: CorsOptions;

  if (
    allowedOrigins.includes(req.headers['access-control-allow-origin'] || '')
  ) {
    // Enable CORS for this request
    corsOptions = { origin: true, optionsSuccessStatus: 200 };
  } else {
    // Disable CORS for this request
    corsOptions = { origin: false };
  }

  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));

app.get('/contentful-content', async (req, res) => {
  const { content } = req.query;

  if (!content) res.send('query parameter is missing');

  const result = await axios.get(
    `${process.env.API_BASE_URL}/spaces/${process.env.CONTENTFUL_SPACE_ID}/content_types/${content}?access_token=${process.env.API_KEY}`
  );

  const contentfulFields = result.data.fields;

  let vueFields: Content[] = [];

  try {
    for (const field in contentfulFields) {
      const contentField = {
        id: contentfulFields[field].id,
        name: contentfulFields[field].name,
        type: contentfulFields[field].type,
        required: contentfulFields[field].required,
      };
      vueFields.push(contentField);
    }
  } catch (err) {
    console.log(err);
    res.send('Error while parsing contentful fields');
  }

  if (!result) res.send('Error');
  res.send('contactForm');
});

app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);
});
