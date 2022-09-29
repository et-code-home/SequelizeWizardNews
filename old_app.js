const express = require("express");
const postBank = require("./postBank");
const client = require("./db/index");
const app = express();

app.use(express.static('public'));

app.get("/", async (req, res) => {
  // allPosts = postBank.list();
  const data = await client.query('SELECT * FROM posts');
  const allPosts = data.rows;

  let html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <div class="news-list">
        <header><img src="/logo.png"/>Wizard News</header>
        ${allPosts.map(post => `
          <div class='news-item'>
            <p>
              <span class="news-position">${post.id}. ▲</span><a href="/posts/${post.id}">${post.title}</a>
              <small>(by ${post.name})</small>
            </p>
            <small class="news-info">
              ${post.upvotes} upvotes | ${post.date}
            </small>
          </div>`
        ).join('')}
      </div>
    </body>
  </html>
  `;

  res.send(html);
  
  // res.send(`
  // <ul>
  //   ${allPosts.map(post => `<li>${post.name + " : " + post.title}</li>`)}
  // </ul
  // `);
});

app.get('/posts/:id', async (req, res) => {
  const id = req.params.id;
  // const post = postBank.find(id);

  const data = await client.query(`SELECT * FROM posts WHERE id=$1`, [id]);
  const post = data.rows[0]; 
  console.log(post);

  if (!post.id) {
    // If the post wasn't found, just throw an error
    throw new Error('Not Found')
  }

  let html = `
  <!DOCTYPE html>
    <html>
      <head>
        <title>Wizard News</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <div class="news-list">
          <header><img src="/logo.png"/>Wizard News</header>
            <div class='news-item'>
              <p>
                <span class="news-position">${post.id}. ▲</span>${post.title}
                <small>(by ${post.name})</small>
              </p>
              <small class="news-info">
                ${post.upvotes} upvotes | ${post.date}
              </small>
            </div>
        </div>
      </body>
    </html>`;

  res.send(html);
});

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
