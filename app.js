const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const ejs = require('ejs');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/toDoDB', {useNewUrlParser:true, useUnifiedTopology: true })

app.listen(process.env.PORT || 3000, ()=>{
    console.log("listening on port 3000")
})
mongoose.set('useFindAndModify', false);
const TodoSchema = new mongoose.Schema({
    name:  {
        type: String,
        required: true,
        min: 1,
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
        if(err){
            console.log(err)
        }
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
    todoTitle.find({},(err, todos)=>{
        todoTitle.findOne({_id:reqID},(err, foundtodo)=>{
            if(err){
                console.log(err)
            }
            res.render('list.ejs', {
                todos: todos,
                todostitle: foundtodo.title,
                todocontent: foundtodo.content,
                todoID: foundtodo._id,
                foundtodo: foundtodo,
            })
        })   
    })
})

app.post('/addNewTodo', (req,res)=>{
    let newItem = new todo({name:req.body.newItem})
    let listtitle = req.body.listTitle;
    todoTitle.findOne({_id:listtitle},(err, foundtodo)=>{
        if(err){
            console.log(err)
        }
        foundtodo.content.push(newItem);
        foundtodo.save();
        res.redirect('/list/'+listtitle);
    })
})

app.post('/removeList',(req,res)=>{
    let listID = req.body.removeList;
    todoTitle.findOneAndDelete({_id:listID}, (err, foundlist)=>{
        if(err){console.log(err)};
        res.redirect('/');
    })
})
app.post('/removeTodo',(req,res)=>{
    let todoID = req.body.removeTodo;
    let listID = req.body.listID;
    todoTitle.findOneAndUpdate({_id: listID}, {$pull: {content: {_id: todoID}}}, (err, foundtodo)=>{
        if(err){
            console.log(err)
        }
        res.redirect('/list/'+listID);
    })
})  