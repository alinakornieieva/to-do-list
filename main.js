const form = document.querySelector('.form');
const input = document.querySelector('input');
const emptyList = document.querySelector('.empty-list');
const listOut = document.querySelector('.out');
const deleteAllBtn = document.querySelector('.delete-all-btn');
let tasks = [];

if (localStorage.getItem('taskItems')) {
    tasks = JSON.parse(localStorage.getItem('taskItems'));
    tasks.forEach( task => {
        renderTask(task);
    })
}

function renderTask(task) {
    const cssClass = task.done ? 'title checked' : 'title';
    const taskHTML = `<div id="${task.id}" class="list-item">
    <p class="${cssClass}">${task.text}</p>
    <div class="list-item-btn">
    <button data-check class="list-item-btn-check"><i data-check class="fa-solid fa-check"></i></button>
    <button data-xmark class="list-item-btn-xmark"><i data-xmark class="fa-solid fa-xmark"></i></button>
    </div>
    </div>`;
    listOut.insertAdjacentHTML('beforeend', taskHTML);
}


checkChildren();

form.addEventListener('submit', addNewTask)
listOut.addEventListener('click', btnInteraction)
deleteAllBtn.addEventListener('click', deleteAllTasks)

function setToLacalStorage() {
    localStorage.setItem('taskItems', JSON.stringify(tasks));
}

function checkChildren() {
    if (tasks.length === 0) {
        const emptyListHTML = `<div class="empty-list">
            <div class="div-img">
                <img src="img/main.png" alt="">
            </div>
            <p>List is empty</p>
        </div>`;
        listOut.insertAdjacentHTML('afterbegin', emptyListHTML);
    }
    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('.empty-list');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function deleteAllTasks() {
    const checkedItems =  document.querySelectorAll('[data-checked]');
    checkedItems.forEach( item => {
        item.remove();
        const currentId = item.id;
        const index = tasks.findIndex( task => {
            if (task.id == currentId) return true;
        })
        tasks.splice(index, 1);
    })
    checkChildren();
    setToLacalStorage()
}

function btnInteraction(event) {
    if (event.target.hasAttribute('data-xmark')) {
        const currentDeleteItem = event.target.closest('.list-item');
        const currentId = currentDeleteItem.id;
        const index = tasks.findIndex( task => {
            if (task.id == currentId) return true;
        })
        tasks.splice(index, 1);
        currentDeleteItem.remove();
    }
    if (event.target.hasAttribute('data-check')) {
        const currentTaskHTML = event.target.closest('.list-item')
        const currentTask = currentTaskHTML.querySelector('p');
        currentTask.classList.toggle('checked');
        currentTaskHTML.setAttribute('data-checked', '');

        const currentId = currentTaskHTML.id;
        const task = tasks.find( task => {
            if (task.id == currentId) return true;
        })
        task.done = !task.done;
    }
    checkChildren();
    setToLacalStorage();
}

function addNewTask(event) {
    event.preventDefault();
    const taskText = input.value;
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    }
    tasks.push(newTask);
    renderTask(newTask);
    input.value = ' ';
    input.focus();
    checkChildren();
    setToLacalStorage()
}
