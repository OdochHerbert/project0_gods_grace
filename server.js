const express=require('express')
const expressLayouts=require('express-ejs-layouts')
const path=require('path')
const mongoose=require('mongoose')
//BRINGING IN THE TWO SESSION BROTHERS TO DISPLAY FLASH MESSAGES AFTER A SEESION IS COMPLETED SUCCESSFULY
const flash=require('connect-flash')
const session=require('express-session')
const passport=require('passport')
var exphbs=require('express-handlebars')



const app=express()

require('./config/passport')(passport)

require('./config/keys');

//EJS
app.use(expressLayouts)
app.set('view engine','ejs')
///Bodyparser-gets data from the form with req.body
app.use(express.urlencoded({extended:false}))


//EXPRESS BROTHERS MIDDLEWARE
//1.Express Session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))

//passport middlearware to be placed btn express and flash
app.use(passport.initialize())
app.use(passport.session())

//2.Connnect Flash
app.use(flash())

//3.Global vars
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg')
    res.locals.error_msg=req.flash('error_msg')
    res.locals.error=req.flash('error')
    next()
})

//setting static public folder

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static('public'));

const PORT=process.env.PORT || 3000

//Routes
app.use('/',require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/grace',require('./routes/grace'))

app.listen(PORT, console.log('Server started on ${PORT}'))