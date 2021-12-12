import axios from 'axios'
import jwt_decode from 'jwt-decode'

const serverAPI = 'http://localhost:3000'
const loginForm = document.querySelector('#login');
const registerForm = document.querySelector('#register');
const postForm = document.querySelector('#post');
const output = document.querySelector('#output')
const dataButton = document.querySelector('#data-button')
const deleteForm = document.querySelector('#delete-post');

// Bind event listeners
window.addEventListener("beforeunload", unload)
loginForm.addEventListener('submit', login);
registerForm.addEventListener('submit', register);
postForm.addEventListener('submit', postEntry)
dataButton.addEventListener('click', getData)
deleteForm.addEventListener('submit', deleteEntry)

async function getAllData() {
    try {
        const res = await axios.get(`${serverAPI}/posts`)
        console.log(res.data)
    } catch(err) {
        output.textContent = err.message;
    }
}

// post request user login
async function loginUser(userData){
    try {
        const res = await axios.post(`${serverAPI}/auth/login`, userData)
        const token = res.data.token
        const user = jwt_decode(token);
        console.log(user)
        localStorage.setItem("token", token);
        localStorage.setItem("user_id", user._id);
        //localStorage.setItem("userEmail", user.email);
        output.textContent = `Welcome ${user.name}`;
        axios.defaults.headers.common = {'Authorization': token}
    } catch(err) {
        output.textContent = err.message;
    }
}

// user login submit handler
function login(e) {
    e.preventDefault();
    loginUser(Object.fromEntries(new FormData(e.target).entries()))
}

// post request new registration
async function registerUser(userData) {
    try {
        const res = await axios.post(`${serverAPI}/auth/register`, userData)
        output.textContent = 'thanks for registering';
    } catch(err) {
        output.textContent = err.message;
    }
}

// registration submit handler
function register(e) {
    e.preventDefault();
    registerUser(Object.fromEntries(new FormData(e.target).entries()))       
}

// create post
async function createPost(post) {
    try {
        const res = await axios.post(`${serverAPI}/posts/create`, post)
        output.textContent = 'Post submitted';
    } catch(err) {
        output.textContent = err.message;
    }
}

// submit post handler
function postEntry(e) {
    e.preventDefault()
    createPost({ ...Object.fromEntries(new FormData(e.target).entries()),
        user_id: localStorage.getItem("user_id")})
    e.target.reset()
}


// delete post
async function deletePost(postId) {
    try {
        const res = await axios.delete(`${serverAPI}/posts/delete/${postId}`)
        output.textContent = 'Post deleted';
    } catch(err) {
        output.textContent = err.message;
    }
}
// submit delete handler
function deleteEntry(e) {
    e.preventDefault()
    deletePost((Object.fromEntries(new FormData(e.target).entries())).post_id)
}

function getData(e) {
    getAllData();
}

function unload(e) {
    localStorage.clear();
}
/*
function updateDog(id, tr){
    const options = { 
        method: 'PATCH',
    };
    fetch(`http://localhost:3000/dogs/${id}`, options)
        .then(r => r.json())
        .then(data => {
            const { dog } = data
            tr.querySelectorAll('td')[1].textContent = dog.age
        })
        .catch(console.warn)
}

function deleteDog(id, li){
    console.log('deleting', id)
    const options = { 
        method: 'DELETE',
    };
    fetch(`http://localhost:3000/dogs/${id}`, options)
        .then(li.remove())
        .catch(console.warn)
}

// helpers
function appendDogs(data){
    data.dogs.forEach(appendDog);
};

function appendDog(dogData){
    const newRow = document.createElement('tr');
    const dogLi = formatDogTr(dogData, newRow)
    dogsList.append(newRow);
};


function formatDogTr(dog, tr){
    const nameTd = document.createElement('td');
    const ageTd = document.createElement('td');
    const delTd = document.createElement('td');
    const uptTd = document.createElement('td');

    const delBtn = document.createElement('button');
    const uptBtn = document.createElement('button');
    delBtn.setAttribute('class', 'delete')
    uptBtn.setAttribute('class', 'update')
    delBtn.textContent = 'X';
    uptBtn.textContent = '+';
    delBtn.onclick = () => deleteDog(dog.id, tr);
    uptBtn.onclick = () => updateDog(dog.id, tr);
    delTd.append(delBtn);
    uptTd.append(uptBtn);

    nameTd.textContent = dog.name
    ageTd.textContent = dog.age

    tr.append(nameTd)
    tr.append(ageTd)
    tr.append(delTd)
    tr.append(uptTd)

    return tr
}

// ********************************************

// MESSAGE FLOW
function getMessage(){
    fetch('http://localhost:3000')
        .then(r => r.text())
        .then(renderMessage)
        .catch(console.warn)
};

function renderMessage(msgText){
    document.querySelector('#msg-btn').textContent = msgText;
};



// ********************************************
*/