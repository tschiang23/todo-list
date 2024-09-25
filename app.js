const express = require('express')
const mongoose = require('mongoose')
const exphbs  = require('express-handlebars')
const Todo = require('./models/todo')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

const app = express()

mongoose.connect(process.env.MONGODB_URI)

  // 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs.engine({defaultLayout: 'main',extname:'.hbs'}));
app.set('view engine', 'hbs')
// 使用 body-parser 的 URL 編碼解析功能
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    Todo.find() // 取出 Todo model 裡的所有資料
        .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
        .sort({ _id: 'asc' }) // 根據 _id 升冪排序
        .then(todos => res.render('index',{todos}))
        .catch(error => console.error(error))
})

app.get('/todos/new', (req, res) => {
    return res.render('new')
  })

app.post('/todos', (req, res) => {
    const name = req.body.name.trim()       // 從 req.body 拿出表單裡的 name 資料
    return Todo.create({ name })     // 存入資料庫
      .then(() => res.redirect('/')) // 新增完成後導回首頁
      .catch(error => console.log(error))
  })

  app.get('/todos/:id', (req, res) => {
    const id = req.params.id
    return Todo.findById(id)
      .lean()
      .then((todo) => res.render('detail', { todo }))
      .catch(error => console.log(error))
  })

  app.get('/todos/:id/edit', (req, res) => {
    const id = req.params.id
    return Todo.findById(id)
      .lean()
      .then((todo) => res.render('edit', { todo }))
      .catch(error => console.log(error))
  })

  app.post('/todos/:id/edit', (req, res) => {
    const id = req.params.id
    const { name, isDone } = req.body
    return Todo.findById(id)
      .then(todo => {
        todo.name = name
        todo.isDone = isDone === 'on'
        return todo.save()
      })
      .then(()=> res.redirect(`/todos/${id}`))
      .catch(error => console.log(error))
  })

  app.post('/todos/:id/delete', (req, res) => {
    const id = req.params.id
    return Todo.findById(id)
      .then(todo => todo.deleteOne())
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  })

app.listen(3000,()=>{
    console.log('App is running on http://localhost:3000.')
})