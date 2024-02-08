const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({ extended: true })) 
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
const logger = (req, res, next) => { 
  console.log(`
      ${req.method} 
      ${req.url}
      ${JSON.stringify(req.body)}
      ${JSON.stringify(req.query)}`); 
      next(); 
  }; 

  app.use(logger); 

const userArr = [];

app.post('/api/users', (req,res) => {
  const username = req.body.username;
  const id = userArr.length.toString();
  userArr.push({username:username, count:0, _id:id});
  res.json({username:username, _id:id});
});

app.get('/api/users', (req,res) => {
  res.json(userArr);
});

app.post('/api/users/:_id/exercises', (req,res) => {
  const id = req.params._id;
  const description = req.body.description;
  const duration = parseInt(req.body.duration);
  let date = new Date(req.body.date).toDateString();
  if(date === 'Invalid Date'){ date = new Date().toDateString();}
  // if(!userArr[id].hasOwnProperty('count')){
  //   userArr[id].count = 1;
  // }else{
  userArr[id].count++;
  // }
  if(!userArr[id].hasOwnProperty('log')){
    userArr[id]['log'] = [];
    userArr[id]['log'].push({description:description, duration:duration, date:date});
  }else{
    userArr[id]['log'].push({description:description, duration:duration, date:date});
  }
  res.json({_id:id, username:userArr[id].username, date:date, duration:duration, description:description});
});

app.get('/api/users/:_id/logs', (req, res) => {
  const id = req.params._id;
  const { from, to, limit } = req.query;
  const copyArr = JSON.parse(JSON.stringify(userArr[id]));
  let userLogs = copyArr;

  // Filter logs based on 'from' and 'to' dates
  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    userLogs.log = userLogs.log.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= fromDate && logDate <= toDate;
    });
  }

  // Apply 'limit' to restrict the number of logs
  if (limit) {
    userLogs.log = userLogs.log.slice(0, parseInt(limit, 10));
  }
  // console.log(userLogs);
  console.log("returning log:" + JSON.stringify(userLogs));
  res.json(userLogs);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
