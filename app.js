//Selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

//Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("click", filterTodo);

//Functions
const capitalizeFirstLetter = (str) =>
  str.substring(0, 1).toUpperCase() + str.substring(1, str.length);

const assignName = () => {
  let getName = null;

  while (getName === null || !isNaN(getName)) {
    getName = prompt("What is your name ? ");

    if (getName === null || !isNaN(getName)) {
      return alert("Invalid name, please try again");
    }

    const header = document.getElementById("header");
    const h1 = document.createElement("h1");
    const text = document.createTextNode(
      capitalizeFirstLetter(getName) + "'s To Do List"
    );
    h1.appendChild(text);

    header.appendChild(h1);
  }
};

//check all trash buttons
const checkIfDeleteButtonExists = () => {
  const exists = document.querySelector(".delete-all-button");
  return exists ? true : false;
};

const createDeleteAllButton = () => {
  if (!checkIfDeleteButtonExists()) {
    const formDoc = document.querySelector("form");
    const deleteAllBtn = document.createElement("button");
    deleteAllBtn.innerHTML = "Delete All";
    deleteAllBtn.className = "delete-all-button";
    formDoc.appendChild(deleteAllBtn);

    deleteAllBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const deleteButton = document.querySelector(".delete-all-button");
      const todoParrent = document.querySelector(".todo-list");
      const items = Array.from(todoParrent.children);

      let currentItem = 0;
      const interval = setInterval(() => {
        const item = items[currentItem];

        item.classList.add("fall");
        removeLocalTodos(item);
        item.addEventListener("transitionend", function () {
          item.remove();
        });

        currentItem += 1;

        if (currentItem >= items.length) {
          setTimeout(() => {
            deleteButton.classList.add("fall");
            deleteButton.addEventListener("transitionend", function () {
              deleteButton.remove();
            });
          }, 500);

          clearInterval(interval);
        }
      }, 500);
    });
  }
};

const deleteDeleteAllButton = () => {
  const deleteButton = document.querySelector(".delete-all-button");
  deleteButton.remove();
};

function addTodo(event) {
  event.preventDefault();

  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");

  const newTodo = document.createElement("li");
  newTodo.innerText = todoInput.value;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);

  //add todo to localstorage
  saveLocalTodos(todoInput.value);

  //check mark button
  const completedButton = document.createElement("button");
  completedButton.innerHTML = '<i class="fas fa-check"></i>';
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);
  //check trash button
  const trashButton = document.createElement("button");
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);
  //apend to the list
  todoList.appendChild(todoDiv);
  //clear input
  todoInput.value = "";

  const itemsNumber = todoList.children.length;
  if (itemsNumber > 0) {
    createDeleteAllButton();
  }
}

function deleteCheck(event) {
  const item = event.target;

  //delete todo
  if (item.classList[0] === "trash-btn") {
    const todo = item.parentElement;

    const itemsNumber = todoList.children.length;
    if (itemsNumber == 1) {
      deleteDeleteAllButton();
    }

    //animation
    todo.classList.add("fall");
    removeLocalTodos(todo);
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  }

  //check mark
  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
  }
}

function filterTodo(event) {
  const todos = todoList.childNodes;
  todos.forEach(function (todo) {
    switch (event.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
    }
  });
}

function saveLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  todos.forEach(function (todo) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    const newTodo = document.createElement("li");
    newTodo.innerText = todo;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    //check mark button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);
    //chech trash button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    //apend to the list
    todoList.appendChild(todoDiv);
  });

  //basic logic
  const itemsNumber = todoList.children.length;
  if (itemsNumber > 0) {
    createDeleteAllButton();
  }
}

function removeLocalTodos(todo) {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  const todoIndex = todo.children[0].innerText;
  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

//execution of the code
assignName();
