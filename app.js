const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
// 引用路由器
const routes = require('./routes')

const usePassport = require('./config/passport')
require('./config/mongoose')

const app = express()

const port = process.env.PORT || 3000

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs')

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
}))
// 使用 body-parser 的 URL 編碼解析功能
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassport(app)

app.use(routes)

app.listen(port, () => {
    console.log(`App is running on port:${port}.`)
})