const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
  inputBox.value = inputBox.value.trim();
  if (inputBox.value === "") {
    alert("You must write something!");
  } else {
    let li = document.createElement("li");
    li.innerHTML = inputBox.value;
    listContainer.appendChild(li);

    let editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.classList.add("edit-btn");

    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    span.classList.add("delete-btn");

    li.appendChild(editBtn);
    li.appendChild(span);
    listContainer.appendChild(li);

    saveLocalTodos(inputBox.value);
  }
  inputBox.value = "";
}
//delete task, complete task
listContainer.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("checked");
      saveLocalTodos();
    } else if (e.target.tagName === "SPAN") {
      e.target.parentElement.remove();
      saveLocalTodos();
    } else if (e.target.classList.contains("edit-btn")) {
      let li = e.target.parentElement;
      let currentText = li.firstChild.textContent;

      let inputField = document.createElement("input");
      inputField.type = "text";
      inputField.value = currentText;
      inputField.classList.add("edit-input");

      li.firstChild.replaceWith(inputField);
      inputField.focus();

      inputField.addEventListener("blur", function () {
        saveEditedTask(inputField, li);
      });

      inputField.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          saveEditedTask(inputField, li);
        }
      });
    }
  },
  false
);

function saveLocalTodos() {
  const todos = [];
  document.querySelectorAll("li").forEach((li) => {
    todos.push({
      text: li.firstChild.textContent,
      completed: li.classList.contains("checked"),
    });
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

// function saveLocalTodos() {
//     let todos = [];
//     document.querySelectorAll("li").forEach(function (todo) {
//         todos.push(todo.firstChild.textContent); // Save task text only
//     });
//     localStorage.setItem("todos", JSON.stringify(todos));
// }

function saveEditedTask(inputField, li) {
  let updatedText = inputField.value.trim();

  if (updatedText !== "") {
    let textNode = document.createTextNode(updatedText);
    inputField.replaceWith(textNode);
    saveLocalTodos();
  } else {
    alert("Task cannot be empty!");
    inputField.focus();
  }
}

function showTask() {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.forEach((todo) => {
    let li = document.createElement("li");
    li.innerHTML = todo.text;

    if (todo.completed) {
      li.classList.add("checked");
    }

    let editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.classList.add("edit-btn");
    li.appendChild(editBtn);

    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);

    listContainer.appendChild(li);
  });
}

showTask();

const filterDropdown = document.getElementById("filter-todo");
filterDropdown.addEventListener("change", () =>
  filterTasks(filterDropdown.value)
);

function filterTasks(filter) {
  const todos = document.querySelectorAll("li");
  todos.forEach((todo) => {
    switch (filter) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("checked")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "incomplete":
        if (!todo.classList.contains("checked")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
    }
  });
}
