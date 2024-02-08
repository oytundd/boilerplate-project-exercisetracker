const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(express.json())
app.use(express.urlencoded({ extended: true })) 
const userArr = [];

app.post('/api/users', (req,res) => {
  const username = req.body.username;
  const id = userArr.length;
  userArr.push({username:username, _id:id});
});

app.get('/api/users', (req,res) => {
  res.json(userArr);
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
