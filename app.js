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
    content: [TodoSchema],
})
const todoTitle = mongoose.model('todoTitle', TodoTitleSchema)

app.get('/', (req,res)=>{
    todoTitle.find((err, todos)=>{
        res.render('index.ejs', {
            todos: todos,
        })
    })
})
app.post('/addNewList', (req,res)=>{
    let newList = todoTitle.insertMany({
        title: req.body.newList,
    })
    res.redirect('/')
})
app.get('/list/:todoID', (req,res)=>{
    let reqID = req.params.todoID;
    console.log(req.params.todoID)
    todoTitle.find({},(err, todos)=>{
        todoTitle.findOne({_id:reqID},(err, foundtodo)=>{
            console.log(foundtodo);
            res.render('list.ejs', {
                todos: todos,
                todostitle: foundtodo.title,
                todocontent: foundtodo.content,
            })
        })   
    })
})

app.post('/addNewTodo', (req,res)=>{
    let newItem = req.body.newItem;
    let listtitle = req.body.listTitle;
    console.log(listtitle)
    todoTitle.findOne({_id:listtitle},(err, foundtodo)=>{
        console.log(foundtodo)
        res.redirect('/list/'+listtitle)
    })
})


