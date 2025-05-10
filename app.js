const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.static('public'));


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Load posts from file
const loadPosts = () => {
  try {
    const data = fs.readFileSync('posts.json');
    return JSON.parse(data.toString());
  } catch {
    return [];
  }
};

const savePosts = (posts) => {
  fs.writeFileSync('posts.json', JSON.stringify(posts));
};

// Home page – List all posts
app.get('/', (req, res) => {
  const posts = loadPosts();
  res.render('index', { posts });
});


// Form to create new post
app.get('/new', (req, res) => {
  res.render('new');
});

// Handle new post submission
app.post('/new', (req, res) => {
  const posts = loadPosts();
  const newPost = {
    id: Date.now().toString(),
    title: req.body.title,
    content: req.body.content
  };
  posts.push(newPost);
  savePosts(posts);
  res.redirect('/');
});

// View individual post
app.get('/post/:id', (req, res) => {
  const posts = loadPosts();
  const post = posts.find(p => p.id == req.params.id);
  if (post) {
    res.render('post', { post });
  } else {
    res.status(404).send('Post not found');
  }
});

// Form to edit post
app.get('/edit/:id', (req, res) => {
    const posts = loadPosts();
    const post = posts.find(p => p.id === req.params.id);
    if (post) {
      res.render('edit', { post });
    } else {
      res.status(404).send('Post not found');
    }
  });
  
  // Handle edit form submission
  app.post('/edit/:id', (req, res) => {
    let posts = loadPosts();
    const index = posts.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
      posts[index].title = req.body.title;
      posts[index].content = req.body.content;
      savePosts(posts);
      res.redirect('/post/' + req.params.id);
    } else {
      res.status(404).send('Post not found');
    }
  });


// Delete a post
app.post('/delete/:id', (req, res) => {
    let posts = loadPosts();
    posts = posts.filter(p => p.id !== req.params.id);
    savePosts(posts);
    res.redirect('/');
  });


app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
