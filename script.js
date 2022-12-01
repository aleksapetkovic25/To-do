const toDoContainer = document.getElementById('to_do_list-container');
const toDoInput = document.getElementById('to_do-input');
const taskPriority = document.getElementById('priority');
const addBtn = document.getElementById('add-btn');

let validate = true;

let toDoList = [];

if(localStorage.getItem('toDoList')){
    toDoList = JSON.parse(localStorage.getItem('toDoList'));
    renderTask();
}


// open modal
$('#to_do-legend').modal('show');



function Task(name, status, priority){
    this.name = name;
    this.status = status;
    this.priority = priority;
}

function checkValidate(){
    validate = true;
    toDoInput.classList.remove('error-input');
    taskPriority.classList.remove('error-input');

    if(toDoInput.value == null || toDoInput.value.trim().length === 0){
        toDoInput.classList.add('error-input');
        validate = false;
    }

    if(taskPriority.value == null || taskPriority.value.trim().length === 0){
        taskPriority.classList.add('error-input');
        validate = false;
    }
}

addBtn.addEventListener('click', () => {
    checkValidate();
    if(validate === false){
        return;
    }

    let task = new Task(toDoInput.value, 0, taskPriority.value);
    toDoList.push(task);
    localStorage.setItem('toDoList', JSON.stringify(toDoList));
    renderTask();
}); 

function renderTask(){
    toDoContainer.innerHTML = '';

    if(toDoList.length === 0){
        toDoContainer.innerHTML = `
        <div class="text-center pt-5 empty">
            <img src="./images/empty-list.png" alt="empty list icon">
            <p class="py-3">To do list is empty.</p>
        </div>
        `
        return;
    }
    for(let i = 0; i < toDoList.length; i++){

        const toDoItemContainer = document.createElement('div');
        toDoItemContainer.classList.add('d-flex', 'justify-content-between', 'flex-wrap', 'align-items-center', 'item-container');

        const toDoBtnContainer = document.createElement('div');
        toDoBtnContainer.classList.add('item-btn-container');
        toDoBtnContainer.innerHTML = `
            <div class="dropdown text-end">
                <button class="btn btn-secondary btn-sm text-end dropdown-toggle action-btn" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Action
                </button>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu2">
                    <button class="dropdown-item done-btn" onclick="done(${i})" type="button">Done</button>
                    <button class="dropdown-item progress-btn" onclick="inProgress(${i})" type="button">In progres</button>
                    <button class="dropdown-item delete-btn" onclick="deleteTask(${i})" type="button">Delete</button>
                </div>
            </div>
        `;

        const toDoTitle = document.createElement('div');
        toDoTitle.classList.add('col-12', 'col-sm-4', 'px-0', 'task-name');
        toDoTitle.innerHTML = toDoList[i].name;


        let bgPriority;
        if(toDoList[i].priority === 'High priority'){
            bgPriority = 'bg-danger';
        }
        else if(toDoList[i].priority === 'Middle priority'){
            bgPriority = 'bg-warning';
        }else if(toDoList[i].priority === 'Low priority'){
            bgPriority = 'bg-success';
        }

        const priority = document.createElement('div');
        priority.classList.add(bgPriority, 'priority');
        priority.innerHTML = toDoList[i].priority;

        let statusIcon; 
        if(toDoList[i].status === 0){
            statusIcon = `<i class="fa-regular fa-hourglass-half"></i>`;
        }
        else if(toDoList[i].status === 1){
            statusIcon = `<i class="fa-solid fa-bars-progress" style="color: #ffc107;"></i>`;
        }
        else if(toDoList[i].status === 2){
            statusIcon = `<i class="fa-solid fa-circle-check" style="color: #8abc00;"></i>`;
        }

        const status = document.createElement('div');
        status.classList.add('status');
        status.innerHTML = statusIcon;

        

        toDoItemContainer.appendChild(toDoTitle);
        toDoItemContainer.appendChild(priority);
        toDoItemContainer.appendChild(status);
        toDoItemContainer.appendChild(toDoBtnContainer);

        toDoContainer.prepend(toDoItemContainer);
    }
}

function done(task){
    toDoList[task].status = 2;

    Swal.fire({
        toast: true,
        timer: 3000,
        position: 'bottom-end',
        showConfirmButton: false,
        timerProgressBar: true,
        text: "Task is done.",
        icon: "success",
        buttonsStyling: false,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    renderTask();
    localStorage.setItem('toDoList', JSON.stringify(toDoList));
}

function inProgress(task){
    toDoList[task].status = 1;

    Swal.fire({
        toast: true,
        timer: 3000,
        position: 'bottom-end',
        showConfirmButton: false,
        timerProgressBar: true,
        text: "Task in progres.",
        icon: "info",
        buttonsStyling: false,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    renderTask();
    localStorage.setItem('toDoList', JSON.stringify(toDoList));
}

function deleteTask(task){
    Swal.fire({
        title: 'Are you sure?',
        text: "You will not be able to recover the assignment!",
        icon: 'warning',
        showCancelButton: true,
        customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-light'
        },
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancle'
    }).then((res) => {
        if(res.isConfirmed){
            Swal.fire({
                toast: true,
                timer: 3000,
                position: 'bottom-end',
                showConfirmButton: false,
                timerProgressBar: true,
                text: "Successfully deleted.",
                icon: "success",
                buttonsStyling: false,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });

            toDoList.splice(task, 1);
            localStorage.setItem('toDoList', JSON.stringify(toDoList));
            renderTask();
        }
    });

    
}
