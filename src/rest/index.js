import express from 'express';

import blogRouter from './controllers/blog.js';
import postRouter from './controllers/post.js';
import userRouter from './controllers/user.js';
import commentRouter from './controllers/comment.js';

const app = express();

app.use(express.json());

app.use('/rest/blog', blogRouter);
app.use('/rest/post', postRouter);
app.use('/rest/user', userRouter);
app.use('/rest/comment', commentRouter);

app.listen(4001);
console.log("Running a REST API server at http://localhost:4001/rest");