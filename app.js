const express=require('express')
const expressLayouts=require('express-ejs-layouts');
const fileUpload=require('express-fileupload');
const session=require('express-session');
const cookieParser=require('cookie-parser');
const flash=require('connect-flash');


const app=express();
const port=process.env.PORT || 3000;

require('dotenv').config();

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(expressLayouts);

app.use(cookieParser('CookingBlogSecure'));
app.use(session({
    secret:'CookingBlogSecretSession',
    saveUninitialized:true,
    resave:true
}));
app.use(flash());
app.use(fileUpload());
var methodOverride = require('method-override')

// override with POST having ?_method=PUT
app.use(methodOverride('_method'))

app.set('layout' , './layouts/main');
app.set('view engine','ejs')

const routes=require('./server/routes/recipeRoutes.js')
app.use('/',routes);

app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`)
})