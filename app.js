const express = require('express');
const bodyParser = require('body-parser');
const date = require('./public/js/date');

const app = express();
var day;
var tasks = []

app.use(bodyParser.urlencoded({ extended:true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res)=> {
    day = getDateString();
    res.render('list', { day: day, tasks: tasks });
});

app.post('/', (req, res)=> {
    day = date();
    tasks.push(req.body.task);
    console.log(tasks);
    res.render('list', { day: day, tasks: tasks });
});

app.listen(3000, ()=> {
    console.log('You know what it is');
});