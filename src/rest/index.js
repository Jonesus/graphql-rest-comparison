import sqlite3 from 'sqlite3';
import express from 'express';

import blogRouter from './controllers/blog.js';

const app = express();

app.use('/rest/blog', blogRouter)

app.listen(4001);
console.log("Running a REST API server at http://localhost:4001/rest");