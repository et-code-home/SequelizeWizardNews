const express = require("express");
const postBank = require("./postBank");
const client = require("./db/index");
const routes = require('./routes/posts');
const app = express();

app.use(express.static('public'));
// parses url-encoded bodies
app.use(express.urlencoded({ extended: false }));

app.use('/posts', routes);

app.get("/", (req, res) => {
  res.redirect("/posts");
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
