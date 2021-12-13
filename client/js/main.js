const axios = require('axios')
const jwt_decode = require('jwt-decode')

const serverAPI = 'http://localhost:3000'
const loginForm = document.querySelector('#login')
const registerForm = document.querySelector('#register')
const tablinks = document.getElementsByClassName('tablink')

// Bind event listeners
loginForm.addEventListener('submit', login)
registerForm.addEventListener('submit', register)
for(const tablink of tablinks)
    tablink.addEventListener('click', showForm)


// post request user login
async function loginUser(userData){
    try {
        const res = await axios.post(`${serverAPI}/login`, userData)
        const token = res.data.token
        const user = jwt_decode(token);
        localStorage.setItem("token", token);
        localStorage.setItem("username", user.username);
        localStorage.setItem("userEmail", user.email);
        window.location.href = "index.html"
        //axios.defaults.headers.common = {'Authorization': token}
    } catch(err) {
        output.textContent = err.response.data.err
    }
}

// post request new registration
async function registerUser(userData) {
    try {
        const res = await axios.post(`${serverAPI}/register`, userData)
        output.textContent = `Thanks for registering ${userData.username}, please login.`
    } catch(err) {
        output.textContent = err.response.data.err
    }
}

// user login submit handler
function login(e) {
    e.preventDefault();
    loginUser(Object.fromEntries(new FormData(e.target).entries()))
}

// registration submit handler
function register(e) {
    e.preventDefault();
    registerUser(Object.fromEntries(new FormData(e.target).entries()))       
}

// tab link handler 
function showForm(e) {
    const forms = document.querySelectorAll('form')
    const tabBorders = document.getElementsByClassName('tab-border')
    for(const form of forms)
        form.style.display = 'none'
    for(const tabBorder of tabBorders)
        tabBorder.className = tabBorder.className.replace(' w3-border-light-green', '')
    e.target.className += ' w3-border-light-green';
    const form = e.target.id.replace('-link', '')
    document.getElementById(form).style.display = 'block'
}

module.exports = { login, register }