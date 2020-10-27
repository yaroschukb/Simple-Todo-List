const { Router } = require('express')
const Todo = require('../models/Todo')
const router = Router()



//auth block
router.get('/home', function (req, res) {
  res.render('home', {
    title: 'Home page'
  });
});

router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register Form' 
  });
});

router.get('/login', (req, res)=>{
  res.render('login', {
      title: 'Login Form',
      isAuth: true,
  })
})


router.get('/protected', (req, res) => {
  if (req.user) {
      res.render('protected');
  } else {
      res.render('login', {
          message: 'Please login to continue',
          messageClass: 'alert-danger'
      });
  }
});
// ======= || =======

router.get('/', async (req, res) => {
  const todos = await Todo.find({}).lean()

  res.render('index', {
    title: 'Todos list',
    isIndex: true,
    todos
  })
})

//create new task
router.get('/create', (req, res) => {
  res.render('create', {
    title: 'Create todo',
    isCreate: true
  })
})

//show all completed tasks
router.get('/already', async (req, res) => {
  const todos = await Todo.find({completed:true}).lean()
  res.render('already', {
    title: 'Already todo',
    isAlready: true,
    todos
  })
})

//post all completed tasks
router.post('/already', async (req, res) => {
  const todos = await Todo.find({completed:true}).lean()
  res.render('already', {
    title: 'Already todo',
    isAlready: true,
    todos
  })
})

//create items
router.post('/create', async (req, res) => {
  const todo = new Todo({
    title: req.body.title
  })

  await todo.save()
  res.redirect('/')
})

//completed items
router.post('/completed', async (req, res) => {
  const todo = await Todo.findById(req.body.id)

  todo.completed = !!req.body.completed;
  await todo.save()

  res.redirect('/')
});

//delete item
router.post('/delete', async (req, res) => {
  await Todo.findByIdAndDelete (req.body.id)
  res.redirect('/already') 
});


module.exports = router;