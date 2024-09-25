const express = require('express')
const mongoose = require('mongoose')
const exphbs  = require('express-handlebars')
const methodOverride = require('method-override') 
// 引用路由器
const routes = require('./routes')

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
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

app.listen(3000,()=>{
    console.log('App is running on http://localhost:3000.')
})