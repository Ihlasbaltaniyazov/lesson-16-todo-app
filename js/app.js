const app = document.querySelector("#app")
const tasks = document.querySelector("#tasks")

const taskForm= document.querySelector('.form')
const taskTitle = document.querySelector('#task-title')
const taskCategory = document.querySelector('#task-category')

function setHeaders(addHeaders) {
    return {
        Authorization: 'Bearer ' + localStorage.getItem("todo-token"),
        ...addHeaders,
    }
}

function getAllTasks() {
    fetch('http://todo.paydali.uz/api/tasks', {
        headers:setHeaders(),
    })
    .then(res => res.json())
    .then(data => renderTasks(data.payload))
}


function renderTasks(taskArray) {
    tasks.innerHTML = '' 
    taskArray.map(item => {
       tasks.innerHTML += ` 
       <li class="task-item" >
       <div >
       <h4>${item.task}</h4>
       <span>${item.category.name}</span>
       </div>

       ${item.task}

       <div class="item-btns">
       <input type="checkbox" ${item.is_done ? 'checked': '' } 
       onchange="complateTask(
        ${item.id}, ${item.is_done})"/>
           <button onclick="deleteTask('${item.id}')" class="btn">Delete</button>
       </div>
   </li>`
    })
}

function completeTask(id, is_done ) {
    fetch(`http://todo.paydali.uz/api/tasks/${id}`, {
        method: 'PUT',
        headers: setHeaders({
            'content-type':  'application.json',
     }),
        body: JSON.stringify({is_done: !is_done }),
    })
    .then(res => res.json())
    .then(data => {
        getAllTasks()
    })
}

function deleteTask(taskId) {
    fetch(`http://todo.paydali.uz/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers:setHeaders()
    })
    .then(res => res.json())
    .then(data => {
        Swal.fire('Good Job', '', 'success')
        getAllTasks()
    })
}

function getAllCategories() {
    fetch('http://todo.paydali.uz/api/categories', {
        headers: setHeaders(),
    })
    .then(res => res.json())
    .then(data => {
        data?.data?.map(item =>  {
            taskCategory.innerHTML += `
            <option value="${item.id}">${item.name}</option>
            `
        })
    })
}

getAllCategories()

function createTask() {
    const data = {
        task:taskTitle.value,
        category_id:taskCategory.value,
        description: '',
    }

    fetch('http://todo.paydali.uz/api/tasks', {
        method: 'POST',
        headers: setHeaders({
            'Content-type': 'Application/json',
        }),
        body: JSON.stringify(data),
    })
    .then(res => res.json())
    .then(data => {
        if(data.code === 200){
            Swal.fire('Добавлено+', 'Задача была добавлена успешно!', 'success') 
            getAllTasks()
        } else{
            Swal.fire('Ошибка', data.message, 'error')
        }
    })
    .catch(err =>{
        Swal.fire('Oops', err.message, 'error')
    })
}

taskForm.addEventListener('submit', e => {
    e.preventDefault()
    createTask()
})