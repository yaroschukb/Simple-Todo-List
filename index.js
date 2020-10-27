const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const todoRoutes = require('./routes/todos');
const authRoute = require('./routes/auth.route')
const path = require('path');
const config = require('config');
const PORT = process.env.PORT || config.get('port');


const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});
const app = express();
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(authRoute);
app.use(todoRoutes);



async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })
        app.listen(PORT, () => {
            console.log(`Server already started on ${PORT}...`);
        });
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

start();