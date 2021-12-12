
// Local storage is cleared here
(async () => {
    let outcome = await userExists(currentUser());
    if (outcome == false) {
        localStorage.clear();
    }
})()

function currentUser(){
    const username = localStorage.getItem('username')
    return username;
}

const loginForm = document.querySelector(".login");
const register = require('./register');

async function requestLogin(e){
    e.preventDefault();
    const {email, password} = e.target
    const obj = {
        email: email.value,
        password: password.value
    }

    try {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj)
        }
        const r = await fetch(`http://localhost:3000/login`, options)
        const data = await r.json()
     
        if (data.err) { 
            document.querySelector("body > section > .error-log").textContent = "Error! Invalid email or password, please try again"
            throw Error(data.err); 
        } else {
            document.querySelector("body > section > .error-log").textContent = ""
            login(data.token);
        }
    } catch (err) {
        console.warn(`Error: ${err}`);
    }
}

function login(token){
    const user = jwt_decode(token);
    localStorage.setItem("token", token);
    localStorage.setItem("username", user.username);
    localStorage.setItem("userEmail", user.email);
    window.location.href = "index.html"
}

function logout(){
    localStorage.clear();
    location.hash = '#login';
    window.location.href = "login.html"
}

// There's an issue where the local storage would persist even if the user database is cleared
// I made this function to test if a username exists in the database. If there isn't, the local storage will be cleared
async function userExists(username) {
    const options = {
        headers: new Headers({'Authorization': localStorage.getItem('token')}),
    }
    const fetching = await fetch(`http://localhost:3000/exists/${username}`, options)

    const data = await fetching.json();
    if (data.err) {
        return false;
    }
    if (data.msg == "No user!") {
        return false;
    } else if (data.msg == "User found") {
        return true;
    }     
}

if (document.querySelector("body > section > .login")) {
    loginForm.addEventListener('submit', (e) => {
        requestLogin(e)
    })
}

module.exports = {logout, userExists, requestLogin, currentUser};