const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v1: uuidv1, v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;

// Sample data (replace with database)
let todoList = [];

app.use(cors());

app.use(bodyParser.json());

app.get('/api/todos', (req, res) => {
  res.json(todoList);
});

// Create a new todo
app.post('/api/todos', (req, res) => {
  console.log(req.body);
  const { task, completed } = req.body;
  const newTodo = { id: uuidv1(), task, completed };
  todoList.push(newTodo);
  res.json(newTodo);
});

// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  const todoId = req.params.id;
  const index = todoList.findIndex(todo => todo.id === todoId);

  if (index !== -1) {
    todoList.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
