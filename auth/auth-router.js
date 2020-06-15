const router = require('express').Router();
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secrets = require('../config/secrets')
const db = require('./model')


router.post('/register', (req, res) => {
  const credentials = req.body
  console.log(credentials)
  if(credentials){
    const rounds = process.env.BCRYPT_ROUNDS || 8
    const hash = bcryptjs.hashSync(credentials.password, rounds)
    credentials.password = hash
    db.add(credentials)
    .then(user => {
      const token = generateToken(user)
      res.status(201).json({data: user, token})
    })
    .catch(error => {
      res.status(500).json(error)
    })
  } else {
    res.status(404).json({message: "make a username and password"})
  }
});

router.post('/login', (req, res) => {
  const {username, password} = req.body
  if(req.body){
    db.findBy({username: username})
    .then(([user])=>{
      if (user && bcryptjs.compareSync(password, user.password)){
        const token = generateToken(user)
        res.status(200).json({message: 'welcome', token})
      } else {
        res.status(401).json({message: 'Invalid credentials'})
      }
    }) 
    .catch(error => {
      res.status(500).json({message: error.message})
    })
  } else {
    res.status(400).json({
      message: 'please provide proper credentials'
    })
  }
});

function generateToken ( user )
{
  const payload = {
    subject: user.id,
    username: user.username,
    role: user.role
  };
  const options = {
    expiresIn: '2h'
  };
  return jwt.sign( payload, secrets.jwtSecrets, options );
}

module.exports = router;
