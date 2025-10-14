// 获取元素
const inputTask = document.getElementById("inputTask");
const addTaskButton = document.getElementById("addTaskButton");
const todoList = document.getElementById("todoList");
const emptyState = document.getElementById("emptyState");
const itemsLeft = document.getElementById("itemsLeft");
const filterButtons = document.querySelectorAll(".filter span");

// 任务数组
let todos = [];

// ======================= 添加任务 =======================
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
    renderList();
}

// 回车添加任务
inputTask.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

// 点击按钮添加任务
addTaskButton.addEventListener("click", addTask);

// ======================= 渲染任务 =======================
function renderList(filter = "all") {
    todoList.innerHTML = "";

    let filteredTodos = todos;
    if (filter === "active") {
        filteredTodos = todos.filter(t => !t.completed);
    } else if (filter === "complete") {
        filteredTodos = todos.filter(t => t.completed);
    }

    // 无任务时显示空状态
    if (filteredTodos.length === 0) {
        emptyState.style.display = "flex";
    } else {
        emptyState.style.display = "none";
    }

    // 生成任务项
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

        // 勾选事件
        const checkbox = li.querySelector(".todo_checkbox");
        checkbox.addEventListener("change", () => toggleTask(task.id));

        // 删除事件
        const deleteBtn = li.querySelector(".delete_button");
        deleteBtn.addEventListener("click", () => deleteTask(task.id));

        todoList.appendChild(li);
    });

    updateItemsLeft();
}

// ======================= 切换完成状态 =======================
function toggleTask(id) {
    const task = todos.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderList(getActiveFilter());
    }
}

// ======================= 删除任务 =======================
function deleteTask(id) {
    todos = todos.filter(t => t.id !== id);
    renderList(getActiveFilter());
}

// ======================= 统计剩余任务 =======================
function updateItemsLeft() {
    const activeCount = todos.filter(t => !t.completed).length;
    itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? "s" : ""} left`;
}

// ======================= 筛选按钮逻辑 =======================
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // 移除所有按钮的 active 样式
        filterButtons.forEach(b => b.classList.remove("active"));
        
        // 当前按钮加上 active
        btn.classList.add("active");

        // 获取筛选类型
        const filter = btn.textContent.toLowerCase();
        renderList(filter);
    });
});


function getActiveFilter() {
    const activeBtn = document.querySelector(".filter .active");
    if (!activeBtn) return "all";
    return activeBtn.textContent.toLowerCase();
}

// ======================= 清除已完成 =======================
const clearBtn = document.querySelector(".footer_button");
clearBtn.addEventListener("click", () => {
    todos = todos.filter(t => !t.completed);
    renderList(getActiveFilter());
});

// ======================= 初始化 =======================
renderList();
