showTodoList(localStorage.getItem("oop_todo"))

class TodoItem {
  constructor(text, isUrgent) {
    this.text = text;
    this.isUrgent = isUrgent;
    this.today = new Date();
  }
  createdAt() {
    const dd = String(this.today.getDate()).padStart(2, '0');
    const mm = String(this.today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = this.today.getFullYear();
    return `${mm}/${dd}/${yyyy}`
  }
  setColor() {
    let bg;
    let color;
    if (this.isUrgent.value === "yes") {
      bg = "red";
      color = "white";
    }
    else if (this.isUrgent.value === "no") {
      bg = "green"
      color = "white"
    }
    else {
      bg = "#f7f7f7";
      color = "black"
    }
    return { bg, color }
  }
  getTodoInfo() {
    return {
      id: `${this.today.getMinutes()}_${this.today.getSeconds()}_${this.today.getMilliseconds()}`,
      text: this.text,
      createdAt: this.createdAt(),
      color: this.setColor().color,
      bg: this.setColor().bg
    }
  }
}

function checkStorage(db, item) {
  if (db === null || db === "") {
    localStorage.setItem("oop_todo", JSON.stringify(item))
  } else {
    let str = localStorage.getItem("oop_todo") + `;${JSON.stringify(item)}`;
    localStorage.setItem("oop_todo", str);
  }
  return showTodoList(localStorage.getItem("oop_todo"))
}

function showTodoList(arr) {
  let list;
  if (arr === null) {
    localStorage.setItem("oop_todo", "")
    list = []
    mapTodoList(list);
  }
  if (arr === "") {
    list = arr;
    mapTodoList(list)
  }
  if (arr && arr.length > 0) {
    list = arr.split(";").map(item => JSON.parse(item));
    mapTodoList(list)
  }
  return list;
}

function mapTodoList(arr) {
  const todolist = document.querySelector("#todo-list");
  todolist.innerHTML = "";
  if (arr.length > 0) {
    arr.map(item => {
      todolist.innerHTML += `
      <div style="background-color:${item.bg};color:${item.color}" class="todo-item" id="${item.id}">
      <div class="showOnLoad">
        <p class="createdAt"><small>${item.createdAt}</small></p>
        <p class="todo-text">${item.text}</p>
        <button class="cross" style="color:${item.color}" data-id="${item.id}">&Cross;</button>
        <button class="pencil" style="color:${item.color}" data-id="${item.id}">&trisb;</button>
      </div>
      <div class="hideOnLoad">
        <p class="createdAt"><small>${item.createdAt}</small></p>
        <label>Enter New Text:</label>
        <input type="text" id="input_${item.id}" placeholder="${item.text}" data-str-src=""/>
        <input type="hidden" disabled value="${item.text}"/>
        <p>
          <button class="update" style="color:${item.color}" data-id="${item.id}">SAVE</button>
          <button class="cancel" style="color:${item.color}" data-id="${item.id}">CANCEL</button>
        </p>
      </div>
      </div>
      `
    });
  } else {
    todolist.innerHTML = "<p style='font-weight:bold; text-align: center;'><b>No items to show.</b></p>"
  }
}

document.querySelector("#submit button").addEventListener("click", () => {
  const isUrgent = document.querySelector('#add-todo select');
  const todoText = document.querySelector("#add-todo input");
  if (todoText.value !== "") {
    const newTodo = new TodoItem(todoText.value, isUrgent)
    checkStorage(localStorage.getItem("oop_todo"), newTodo.getTodoInfo())
  }
  isUrgent.value = "...";
  todoText.value = "";
});

document.querySelector("#todo-list").addEventListener("click", (e) => {
  if (e.target.classList.contains("cross")) {
    const showlist = showTodoList(localStorage.getItem("oop_todo"))
    const filtered = showlist.filter(item => item.id !== e.target.getAttribute("data-id"))
    const mapped = filtered.map(item => JSON.stringify(item))
    if (filtered.length > 1) {
      const deleted = mapped.join(";")
      localStorage.setItem("oop_todo", deleted);
      showTodoList(localStorage.getItem("oop_todo"))
    } else if (filtered.length === 1) {
      localStorage.setItem("oop_todo", mapped);
      showTodoList(localStorage.getItem("oop_todo"))
    } else {
      localStorage.setItem("oop_todo", "")
      showTodoList(localStorage.getItem("oop_todo"))
    }
  }
  if (e.target.classList.contains("pencil")) {
    localStorage.setItem("tempTodoItem", "")
    const showlist = showTodoList(localStorage.getItem("oop_todo"))
    const filtered = showlist.filter(item => item.id === e.target.getAttribute("data-id"))
    const exactDiv = filtered[0];
    const divList = document.querySelectorAll(".todo-item")
    const found = Array.from(divList).find(div => div.id === exactDiv.id)
    const shownDiv = found.querySelector(".showOnLoad")
    const hiddenDiv = found.querySelector(".hideOnLoad")
    shownDiv.style.display = "none";
    hiddenDiv.style.display = "block";
    checkForBlockInput(hiddenDiv);
  }
  if (e.target.classList.contains("update")) {
    if (localStorage.getItem("tempTodoItem").length > 0) {
      const showlist = showTodoList(localStorage.getItem("oop_todo"))
      const filtered = showlist.filter(item => item.id === e.target.getAttribute("data-id"));
      const notFiltered = showlist.filter(item => item.id !== e.target.getAttribute("data-id"));
      const exactDiv = filtered[0];
      exactDiv.text = localStorage.getItem("tempTodoItem")
      // console.log(exactDiv);
      if (showTodoList(localStorage.getItem("oop_todo")).length <= 1) {
        localStorage.setItem("oop_todo", JSON.stringify(exactDiv));
        showTodoList(localStorage.getItem("oop_todo"))
      } else if (showTodoList(localStorage.getItem("oop_todo")).length > 1) {
        const allTogether = [...notFiltered, filtered[0]].map(item => JSON.stringify(item)).join(";")
        localStorage.setItem("oop_todo", allTogether);
        showTodoList(localStorage.getItem("oop_todo"))
      }
    }
    else {
      const showlist = showTodoList(localStorage.getItem("oop_todo"))
      const filtered = showlist.filter(item => item.id === e.target.getAttribute("data-id"))
      const exactDiv = filtered[0];
      const divList = document.querySelectorAll(".todo-item")
      const found = Array.from(divList).find(div => div.id === exactDiv.id)
      const shownDiv = found.querySelector(".showOnLoad")
      const hiddenDiv = found.querySelector(".hideOnLoad")
      shownDiv.style.display = "block";
      hiddenDiv.style.display = "none";
    }
  }
  if (e.target.classList.contains("cancel")) {
    const showlist = showTodoList(localStorage.getItem("oop_todo"))
    const filtered = showlist.filter(item => item.id === e.target.getAttribute("data-id"))
    const exactDiv = filtered[0];
    const divList = document.querySelectorAll(".todo-item")
    const found = Array.from(divList).find(div => div.id === exactDiv.id)
    const shownDiv = found.querySelector(".showOnLoad")
    const hiddenDiv = found.querySelector(".hideOnLoad")
    shownDiv.style.display = "block";
    hiddenDiv.style.display = "none";
  }
});

function checkForBlockInput(input) {
  const newWord = input.querySelector("input[type='text']")
  newWord.addEventListener("keyup", (e) => {
    if (e.target.value) {
      localStorage.setItem("tempTodoItem", e.target.value);
    }
  })
}