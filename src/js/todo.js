import { Refs } from './refs';

const { inputEl, addBtnEl, todoListEl } = Refs();

function renderTodoList(list) {
  const listItemHTML = list
    .map(item => {
      return `
      <div class="listItem">
        <p>${item.task}</p>
        <button type="button" data-id="${item.id}" class="delete-btn">delete</button>
      </div>`;
    })
    .join('');

  return listItemHTML;
}

async function fetchTodoList() {
  try {
    const response = await fetch('http://localhost:3000/api/todos');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching todo list:', error);
    return [];
  }
}

async function addTodo(task, completed) {
  try {
    const response = await fetch('http://localhost:3000/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task, completed }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding todo:', error);
    return null;
  }
}

addBtnEl.addEventListener('click', async () => {
  const inputValue = inputEl.value.trim();
  if (inputValue) {
    const newItem = await addTodo(inputValue, false);
    if (newItem) {
      inputEl.value = '';
      const updatedTodoList = await fetchTodoList();
      const updatedListHTML = renderTodoList(updatedTodoList);
      todoListEl.innerHTML = updatedListHTML;
    }
  }
});

todoListEl.addEventListener('click', async event => {
  if (event.target.classList.contains('delete-btn')) {
    const itemId = event.target.getAttribute('data-id');
    const response = await fetch(`http://localhost:3000/api/todos/${itemId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      const updatedTodoList = await fetchTodoList();
      const updatedListHTML = renderTodoList(updatedTodoList);
      todoListEl.innerHTML = updatedListHTML;
    }
  }
});

(async function () {
  const initialTodoList = await fetchTodoList();
  const initialListHTML = renderTodoList(initialTodoList);
  todoListEl.innerHTML = initialListHTML;
})();
