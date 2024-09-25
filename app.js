const express = require('express')
const exphbs  = require('express-handlebars')
const methodOverride = require('method-override') 
// 引用路由器
const routes = require('./routes')
require('./config/mongoose')

const app = express()

const port = process.env.PORT || 3000

app.engine('hbs', exphbs.engine({defaultLayout: 'main',extname:'.hbs'}));
app.set('view engine', 'hbs')
// 使用 body-parser 的 URL 編碼解析功能
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

app.listen(port,()=>{
    console.log(`App is running on port:${port}.`)
})