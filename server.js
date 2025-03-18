const express = require('express');
const app = express();
const port = 3000;

// In-memory data store (replace with a database)
const posts = {
    "cosmic-energy": { likes: 0, comments: [] },
    "human-brain": { likes: 0, comments: [] },
    // ... other posts
};

app.use(express.json());

// Likes API
app.get('/likes/:postId', (req, res) => {
    const post = posts[req.params.postId];
    res.json({ likes: post ? post.likes : 0 });
});

app.post('/likes/:postId', (req, res) => {
    const post = posts[req.params.postId];
    if (post) {
        post.likes++;
        res.json({ likes: post.likes });
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

// Comments API
app.get('/comments/:postId', (req, res) => {
    const post = posts[req.params.postId];
    res.json({ comments: post ? post.comments : [] });
});

app.post('/comments/:postId', (req, res) => {
    const post = posts[req.params.postId];
    const newComment = req.body.comment;
    if (post && newComment) {
        post.comments.push(newComment);
        res.json({ comments: post.comments });
    } else if (!post) {
        res.status(404).json({ error: 'Post not found' });
    } else {
        res.status(400).json({ error: 'Comment cannot be empty' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

