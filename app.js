const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/toDoDB', {useNewUrlParser:true, useUnifiedTopology: true })

app.listen(process.env.PORT || 3000, ()=>{
    console.log("listening on port 3000")
})

const TodoSchema = new mongoose.Schema({
    name:  {
        type: String,
        required: true,
    },
})
const todo = mongoose.model('todo', TodoSchema)

const TodoTitleSchema = new mongoose.Schema({
    title: {
        type: String,
        min: 1,
        max: 30,
    },
    content: TodoSchema,
})
const todoTitle = mongoose.model('todoTitle', TodoTitleSchema)

app.get('/', (req,res)=>{
    todoTitle.find((err, todos)=>{
        res.render('index.ejs', {
            todos: todos,
            todotitle: todoTitle.title,
            todocontent: todoTitle.content,
            todoID: todoTitle._id,
        })
    })
})
app.post('/addNewList', (req,res)=>{
    let newList = todoTitle.insertMany({
        title: req.body.newList,
    })
    res.redirect('/')
})
