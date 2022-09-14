//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require("./public/js/date.js");
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/ToDoListDB').then(() => {
  console.log('Connected to MongoDB');
});

TaskSchema = new mongoose.Schema({
  name: String
});

const Task = mongoose.model('Task', TaskSchema);
const defaultItems =
  [new Task({ name: 'To do List is Empty' }),
  new Task({ name: 'Add Task using + button' }),
  new Task({ name: 'Remove Task by checking the CheckBox' })
  ];

const ListSchema = new mongoose.Schema({
  name: String,
  tasks: [TaskSchema]
});

const List = mongoose.model('List', ListSchema);

app.get("/", function (req, res) {
  const day = date.getDate();
  Task.find({}, (err, results) => {
    if (results.length === 0) {
      Task.insertMany(defaultItems, (err) => {
        if (err) console.log(err);
        else console.log('Default items added');
      });
      res.redirect('/');
    }
    else res.render("list", { listTitle: 'Today', newListItems: results });
  });
});

app.post("/", function (req, res) {
  const newTask = new Task({
    name: req.body.newItem
  });
  const listName = req.body.list;
  console.log(listName);
  if (listName === 'Today') {
    newTask.save().then((taskDoc) => {
      console.log(taskDoc);
      console.log('Saved');
      res.redirect('/')
    });
  } else {
    List.findOne({name: listName}, (err, list)=> {
      list.tasks.push(newTask);
      list.save().then(()=> {
        res.redirect('/' + listName);
      });
    });
  }
});

app.post('/deleteTask', (req, res) => {
  const listName = req.body.listName;
  if(listName === 'Today') {
    Task.findByIdAndRemove(req.body.itemId, (err) => {
      if (err) console.log(err);
      else res.redirect('/');
    });
  } else {
     List.findOneAndUpdate({name: listName}, {$pull: {tasks: {_id: req.body.itemId}}}, (err, list)=> {
      console.log(list);
      res.redirect('/' + listName);
     });
  }
});

app.get('/:listName', (req, res) => {
  List.findOne({ name: req.params.listName }, (err, result) => {
    if (err) console.log(err);
    if (!result) {
      const list = new List({
        name: req.params.listName,
        tasks: defaultItems
      });
      list.save().then((list) => {
        res.redirect('/' + req.params.listName);
      });
    }
    else {
      res.render('list', { listTitle: _.capitalize(result.name), newListItems: result.tasks });
    }
  })
});

app.post('/:listName', (req, res) => {

});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
