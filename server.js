
const express = require('express');
const fs = require('fs'); // عشان نقرأ ونكتب الملفات
const cors = require('cors');
const server = express();
const port = process.env.PORT || 3000;

server.use(cors());
server.use(express.json());

const DATA_FILE = '/tmp/tasks.json';

// دالة تقرأ من الملف
const readTasks = () => {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
};

// دالة تكتب في الملف
const saveTasks = (tasks) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
};

// GET الكل
server.get('/tasks', (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// GET بالـ id
server.get('/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    return res.status(404).json({error: 'task not found'});
  }
  res.json(task);
});

// POST اضافة
server.post('/tasks', (req, res) => {
  const tasks = readTasks();
  // validation line
  if (!req.body.title || req.body.title.trim() === '') {
   return res.status(400).json({error: 'the title is required and cannot be empty.'});
  }
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title.trim(),
    done: false
  };
  tasks.push(newTask);
  saveTasks(tasks); // نحفظ في الملف
  res.status(201).json(newTask);
});

// PUT تعديل
server.put('/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    return res.status(404).json({error: 'task not found'});
  }
 if (typeof req.body.done !== 'boolean') {
    return res.status(404).json({error: 'done it has to be true or false'});
  }  
  task.done = req.body.done;
  saveTasks(tasks);
  res.json(task);
});

// DELETE حذف
server.delete('/tasks/:id', (req, res) => {
  let tasks = readTasks();
  const id = Number(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(tasks);
  res.json({success: true});
});

server.listen(port, () => {
  console.log(`server work on http://localhost:${port}`);
});
/*
server.get('/students', (req, res) => {
    res.json('wellcom back agin');
 });
let tasks =[ 
{id: 1, title: "learn express", done: false},
{id: 2, title: "build api", done: false}
 ];

server.get('/tasks/:id', (req, res) => {
   const id = Number(req.params.id);

   const task = tasks.find((t)=> t.id === id);
   if (!task) {
      return res.status(400).json({error: `task is not fund`});
   }
    res.json(tasks);
 });

 server.post('/tasks', (req, res) => {
   const newTask = {
      id: tasks.length + 1,
      title: req.body.title,
      done: false
   };
   tasks.push(newTask);
    res.json(newTask);
 });

 server.listen(PORT, ()=> {
    console.log(`server work on http://localhost:${PORT}`);
 });
 **/