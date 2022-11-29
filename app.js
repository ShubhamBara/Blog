if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const ejs = require('ejs')
const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')
const methodoverride=require('method-override')
const Passmodel = require('./models/passM')
const { isNotAuthenticated }=require('./config/auth')

const postmodel = require('./models/postM')


const initializePassport = require('./config/passport')
initializePassport(passport,
    email => { return Passmodel.find(user => user.email === email) },
    id => {
        return Passmodel.find(user => user.id === id)

    })

//mongoose connection

const mongoAtlasUrl=process.env.DATABASE_URL

try {
    // Connect to the MongoDB cluster
     mongoose.connect(
      mongoAtlasUrl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => console.log(" Mongoose is connected")
    );

  } catch (e) {
    console.log("could not connect");
  }

const app = express();

//middlewares
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('./static'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(methodoverride('_method'))


//setting view engine(templates)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//home page
app.get('/', async function(req, res){
    const somearticle= await postmodel.find()
    // console.log(somearticle)
    res.render('home',{somearticle:somearticle})
});

//aboutus page
app.get('/about', function (req, res) {
    res.render('about')
});

//admin register
app.get('/register',isNotAuthenticated, (req, res) => {
    res.render('register')
})
app.post('/register', isNotAuthenticated,async (req, res) => {
    try {
        const hashpassword = await bcrypt.hash(req.body.password, 10)
        const newuser = new Passmodel({
            username: req.body.username,
            email: req.body.email,
            password: hashpassword
        })
        let z = await newuser.save()
        res.redirect('/admin/login')

    } catch (error) {
        console.log(error)

    }

})

//admin login page 
app.get('/admin/login',isNotAuthenticated, (req, res) => {
    res.render('login')
})

//admin check
app.post('/admin/login',isNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/admin/post',
    failureRedirect: '/admin/login',
    failureFlash: true
}))

//log out route
app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/admin/login')
})


//admin routes post
const phalana = require('./routes/admin_routes/postR')
app.use('/admin/post', phalana)

//user routes post
const phalana2 = require('./routes/user_routes/postR')
app.use('/user/post', phalana2)

const PORT =process.env.PORT || 5000;

app.listen(PORT, () => { console.log(`started at ${PORT}`) })
