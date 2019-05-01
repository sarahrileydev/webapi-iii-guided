const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const morgan = require('morgan');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));
server.use(teamNamer);
server.use(gate);

// server.use((req, res, next) => {
//   res.status(404).send('Aint nobody got time for that');
// })


server.use('/api/hubs', restricted, only('frodo'), hubsRouter); // only apply to this endpoint

server.get('/', (req, res, next) => {
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome ${req.team} to the Lambda Hubs API</p>
    `);
});

function teamNamer(req, res, next) {
  req.team = 'Lambda Students';
  next();
}

function gate(req, res, next) {
  const seconds = new Date().getSeconds();

  if (seconds % 3 === 0) {
    res.status(403).json({you: 'shall not pass'})
  }else{
    next();
  }
}

function restricted(req, res, next) {
  const password = req.headers.password;
  if(password === 'mellon') {
    next(); //let it go through if password is mellon
  }else{
    res.status(401).json({message: 'invalid credentials'})
  }
}

function only(name){
  return function (req, res, next) {
    const personName = req.headers.name || '';//just in case no header provided

    if(personName.toLowerCase() === name.toLowerCase()) {
      next();
    }else {
      res.status(403).json({message: 'you have no access to this resource'})
    }
  }
}

module.exports = server;
