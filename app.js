const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb+srv://mageswari:openthedoor@mage.ovcndim.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// Schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model('Post', postSchema);

// Home – List all posts
app.get('/', async (req, res) => {
  const posts = await Post.find({});
  res.render('index', { posts });
});

// Form to create new post
app.get('/new', (req, res) => {
  res.render('new');
});

// Handle new post submission
app.post('/new', async (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    content: req.body.content
  });
  await newPost.save();
  res.redirect('/');
});

// View individual post
app.get('/post/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    res.render('post', { post });
  } else {
    res.status(404).send('Post not found');
  }
});

// Form to edit post
app.get('/edit/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    res.render('edit', { post });
  } else {
    res.status(404).send('Post not found');
  }
});

// Handle edit submission
app.post('/edit/:id', async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    content: req.body.content
  });
  res.redirect('/post/' + req.params.id);
});

// Delete a post
app.post('/delete/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

// Start server
app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
});
