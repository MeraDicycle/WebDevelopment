
const inputTask = document.getElementById("inputTask");
const addTaskButton = document.getElementById("addTaskButton");
const todoList = document.getElementById("todoList");
const emptyState = document.getElementById("emptyState");
const itemsLeft = document.getElementById("itemsLeft");
const filterButtons = document.querySelectorAll(".filter span");
const clearBtn = document.querySelector(".footer_button");
const dateElement = document.getElementById("dataElement");



let todos = JSON.parse(localStorage.getItem("todos")) || [];


function saveToLocal() {
    localStorage.setItem("todos", JSON.stringify(todos));
}


function addTask() {
    const taskText = inputTask.value.trim();
    if (taskText === "") return;

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    todos.push(newTask);
    inputTask.value = "";
    saveToLocal();
    renderList(getActiveFilter());
}


inputTask.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});


addTaskButton.addEventListener("click", addTask);


function renderList(filter = "all") {
    todoList.innerHTML = "";

    let filteredTodos = todos;
    if (filter === "active") {
        filteredTodos = todos.filter(t => !t.completed);
    } else if (filter === "complete") {
        filteredTodos = todos.filter(t => t.completed);
    }


    if (filteredTodos.length === 0) {
        emptyState.style.display = "flex";
    } else {
        emptyState.style.display = "none";
    }


    filteredTodos.forEach(task => {
        const li = document.createElement("li");
        li.classList.add("todo_item");

        li.innerHTML = `
            <label class="checkbox_container">
                <input type="checkbox" class="todo_checkbox" ${task.completed ? "checked" : ""}>
                <span class="checkmark"></span>
            </label>
            <span class="todo_list_text ${task.completed ? "completed" : ""}">${task.text}</span>
            <button class="delete_button"><i class="fa-solid fa-times"></i></button>
        `;


        const checkbox = li.querySelector(".todo_checkbox");
        checkbox.addEventListener("change", () => toggleTask(task.id));

        const deleteBtn = li.querySelector(".delete_button");
        deleteBtn.addEventListener("click", () => deleteTask(task.id));

        todoList.appendChild(li);
    });

    updateItemsLeft();
}


function toggleTask(id) {
    const task = todos.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveToLocal();
        renderList(getActiveFilter());
    }
}


function deleteTask(id) {
    todos = todos.filter(t => t.id !== id);
    saveToLocal();
    renderList(getActiveFilter());
}

function updateItemsLeft() {
    const activeCount = todos.filter(t => !t.completed).length;
    itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? "s" : ""} left`;
}


filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
       
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.textContent.toLowerCase();
        renderList(filter);
    });
});

function getActiveFilter() {
    const activeBtn = document.querySelector(".filter .active");
    if (!activeBtn) return "all";
    return activeBtn.textContent.toLowerCase();
}

// function setDate() {
//   const options = { weekday: "long", month: "short", day: "numeric" };
//   const today = new Date();
//   dateElement.textContent = today.toLocaleDateString("en-US", options);
// }


function updateDate() {
  

  const now = new Date(); // 获取当前时间
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = now.toLocaleDateString('en-US', options);

  dateElement.textContent = formattedDate;
}

updateDate(); // 页面加载时运行一次


clearBtn.addEventListener("click", () => {
    todos = todos.filter(t => !t.completed);
    saveToLocal();
    renderList(getActiveFilter());
});

renderList(getActiveFilter());
