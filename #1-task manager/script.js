// --- Step 2: Initialize State and DOM References ---
let tasks = []; // Array to store task objects
let editingTaskId = null; // Keeps track of which task is being edited

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// --- Step 3: The "Read" Function (Displaying Tasks) ---
function renderTasks() {
    // Clear the current list in the UI
    taskList.innerHTML = '';

    // Loop through the array and create UI elements for each task
    tasks.forEach(task => {
        const li = document.createElement('li');

        // Create span for task text
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.name;

        // Create div to hold buttons
        const btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';

        // Create Edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        // Pass the unique ID to the edit function
        editBtn.onclick = () => startEdit(task.id); 

        // Create Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        // Pass the unique ID to the delete function
        deleteBtn.onclick = () => deleteTask(task.id); 

        // Assemble the list item
        btnGroup.appendChild(editBtn);
        btnGroup.appendChild(deleteBtn);
        li.appendChild(span);
        li.appendChild(btnGroup);

        // Append to the main container
        taskList.appendChild(li);
    });
}

// --- Step 4 & 6: The "Create" & "Update" Function ---
addBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    
    // Prevent empty submissions
    if (text === '') return; 

    if (editingTaskId !== null) {
        // UPDATE MODE: Find the task and update its name
        const taskIndex = tasks.findIndex(t => t.id === editingTaskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].name = text;
        }
        
        // Reset UI out of edit mode
        editingTaskId = null;
        addBtn.textContent = 'Add Task';
        addBtn.style.backgroundColor = '#28a745'; // Back to green
    } else {
        // CREATE MODE: Add a new task object to the array
        const newTask = {
            id: Date.now(), // Use timestamp for a simple unique ID
            name: text
        };
        tasks.push(newTask);
    }

    // Clear input field and update the UI
    taskInput.value = '';
    renderTasks();
});

// --- Step 5: The "Delete" Function ---
function deleteTask(id) {
    // Filter out the task with the matching ID, creating a new array
    tasks = tasks.filter(task => task.id !== id);
    
    // Update the UI
    renderTasks();
}

// --- Step 6: Helper Function for "Update" ---
function startEdit(id) {
    // Find the specific task in the array
    const taskToEdit = tasks.find(task => task.id === id);
    
    if (taskToEdit) {
        // Populate the input field with the current task text
        taskInput.value = taskToEdit.name;
        
        // Set the global variable to remember which task we are editing
        editingTaskId = id;
        
        // Change button appearance to indicate Edit Mode
        addBtn.textContent = 'Update Task';
        addBtn.style.backgroundColor = '#ffc107'; // Match edit button color
    }
}