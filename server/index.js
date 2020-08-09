const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const router = require('./router');
const morgan = require('morgan');
const cors = require('cors');
const basicAuth = require('express-basic-auth');
const cookieParser = require('cookie-parser');

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser(process.env.ADMIN_KEY));

const auth = basicAuth({
  users: {
    admin: '123'
  }
});

app.get('/authenticate', auth, (req, res) => {
  const options = {
    httpOnly: true,
    signed: true
  }

  if (req.auth.user === 'admin') {
    res.cookie('name', 'admin', options).send({ screen: 'admin' })
  } else {
    res.send({ screen: 'auth' });
  }
});

app.get('/read-cookie', (req, res) => {
  if (req.signedCookies.name === 'admin') {
    res.send({ screen: 'admin' });
  } else {
    res.send({ screen: 'auth' });
  }
});

app.get('/clear-cookie', (req, res) => {
  res.clearCookie('name').end();
});

app.listen(port, () => console.log(`listening on port ${port}`));

app.use('/', express.static(path.join(__dirname, '../client/dist')));

app.use('/admin/api', router);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
});



