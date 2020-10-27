
const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const todoRoutes = require('./routes/todos');
const path = require('path');
const PORT = process.env.PORT || 80;

const hbs = exphbs.create({
    defaultLayout:'main',
    extname:'hbs'
}); 
const app = express();
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.urlencoded({ extended:true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(todoRoutes);



async function start () {
    try{
        await mongoose.connect('mongodb+srv://Jim_Raynor:123jim123@cluster0.egqey.azure.mongodb.net/toDos', {
            useNewUrlParser:true,
            useFindAndModify:false,
        })
    app.listen(process.env.PORT, ()=>{
        console.log('Server already started...')
    });
    }
    catch(e){
        console.log(e)
    }
}

start();

