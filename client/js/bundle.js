(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const {logout, currentUser} = require('./login');
const habit = require('./habit')


if (document.querySelector("body > .loggedOutNav")) {
    const loggedOutNav = document.querySelector("body > .loggedOutNav");
    const loggedInNav = document.querySelector("body > .loggedInNav");
    const loggedIn = document.querySelector("body > .loggedInNav > div > p a");

    if (currentUser()) {
        
        
        habit;
        loggedOutNav.classList.add("hidden");
        loggedInNav.classList.remove("hidden");
        
        loggedIn.addEventListener('click', logout)
        if (document.querySelector("body > .currUser")) {
            document.querySelector("body > .currUser").textContent = `Let's add a new habit, ${currentUser()}!`;
        }
    } else {
        loggedOutNav.classList.remove("hidden");
        loggedInNav.classList.add("hidden");
    }
    
}









},{"./habit":3,"./login":5}],2:[function(require,module,exports){
async function createHabit(data1) {

    const sec = document.querySelector("body > .habit-list");
    const div = document.createElement("div");
    const div2 = document.createElement("div")
    const div3 = document.createElement("div")
    const div4 = document.createElement("div")
    const h2 = document.createElement("h2");
    const p2 = document.createElement("p");
    const p3 = document.createElement("p");
    const p4 = document.createElement("p");
    const form = document.createElement("form")
    const input = document.createElement("input");
    const form1 = document.createElement("form");
    const form2 = document.createElement("form")
    const input1 = document.createElement("input");
    const input2 = document.createElement("input");
    const section = document.createElement("section")

    let habitFrequency = document.createElement('progress')
    p2.textContent = `${data1.currfreq} / ${data1.frequency}`
    // p3.textContent = `Current Streak: ${data1.currstreak}, Max Streak: ${data1.maxstreak}`
    
    p3.textContent = `Current: ${data1.currstreak} ${data1.currstreak == 1 ? 'streak' : 'streaks'}`
    p4.textContent = `Max Streaks: ${data1.maxstreak} ${data1.maxstreak == 1 ? 'streak' : 'streaks'}`
    habitFrequency.setAttribute('max', data1.frequency)
    habitFrequency.setAttribute('value', data1.currfreq)
    div4.setAttribute("class", "leftOver")
    div4.append(habitFrequency)
    div4.append(p2)
    div4.append(p3)
    div4.append(p4)

    div.setAttribute("class", "inner-habit")
    div.setAttribute("name", data1.habit_id)

    form.setAttribute("name", data1.habit_id);
    form.setAttribute("class", "deletion")

    h2.textContent = `${data1.habit}`
    div2.setAttribute("class", "name")
    div2.append(h2)

    form1.setAttribute("name", data1.habit_id)
    form1.setAttribute("class", "count")

    form2.setAttribute("name", data1.habit_id)
    form2.setAttribute("class", "decrement")

    input1.setAttribute("value", "+")
    input1.setAttribute("type", "submit")
    form1.append(input1)

    input2.setAttribute("value", "-")
    input2.setAttribute("type", "submit")
    form2.append(input2)

    input.setAttribute("value", "DELETE")
    input.setAttribute("type", "submit")
    form.append(input)

    div3.setAttribute("class", "buttons")
    div3.append(form1)
    div3.append(form2)
    div3.append(form)

    section.append(div2)
    section.append(div4)
    section.append(div3)
    div.append(section)

    sec.append(div)
    return { input1, input2, div, habitFrequency }
}



module.exports = {createHabit}
},{}],3:[function(require,module,exports){
const { newHabit, deleteHabit, decrementHabit, updateHabit } = require('./habitUpdateDelete')
const { createHabit } = require('./creation')

const habitForm = document.querySelector(".task")

function currentUser() {
    const username = localStorage.getItem('username')
    return username;
}


if (document.querySelector("body > .hidden_form")) {

    function currentUsr() {
        if (currentUser()) {
            document.querySelector("body > .hidden_form").classList.remove("hidden_form");

            if (document.querySelector("body > section > .task")) {
                habitForm.addEventListener('submit', (e) => {
                    newHabit(e)
                })
            }

        } else {
            // window.location.hash = "/main#login"
            window.location.href = "/login.html#login"
            document.querySelector("body > .hidden_form").classList.add("hidden_form")
        }
    }
    currentUsr()

    async function updateData(currentUser) {
        const options = {
            headers: new Headers({ 'Authorization': localStorage.getItem('token') }),
        }
        const getId = await fetch(`http://localhost:3000/habits/${currentUser}`, options);
        const getIdData = await getId.json();
        getIdData.forEach(async data => {
            const getHabitCount = await fetch(`http://localhost:3000/habits/habits/${data.habit_id}/${currentUser}`)
            const habitCountData = await getHabitCount.json()


        })
    }
    async function habitlist() {

        try {
            const getHabitCount = await fetch(`http://localhost:3000/habits/habits/0/${currentUser()}`)
            const habitCountData = await getHabitCount.json()
         

            habitCountData.forEach(async data1 => {
                const { input1, input2, div, habitFrequency } = await createHabit(data1)

                input1.addEventListener('click', async (e) => {
                    // Incrementing the habit counter
                    updateHabit(data1.habit_id)
                    e.preventDefault()

                    const data2 = {
                        habit_id: data1.habit_id
                    }

                    try {
                        const options = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data2)
                        }

                        const r = await fetch(`http://localhost:3000/habits/${currentUser()}/habits/entries`, options)
                        const data = await r.json()

                        progessBarIncrease(habitFrequency, data)

                        if (data.err) {
                            throw Error(data.err)
                        }

                        window.location.reload()
                    } catch (err) {
                        console.warn(err);
                    }
                });

                function progessBarDecrement(habitFrequency, data1) {

                    // Just incase the disabling of buttons doesn't work, if the frequency is set to undefined, it will exit the function
                    if (data1.frequency == undefined) {
                        return;
                    }
                    habitFrequency.setAttribute('value', data1.frequency)
                }

                // Decrementing the habit counter
                input2.addEventListener('click', async (e) => {
                    try {
                        decrementHabit(data1.habit_id)
                        progessBarDecrement(habitFrequency, data1)
                    } catch (err) {
                        throw err
                    }

                })

                const { oldDateP, oldDateP2, oldDateP3, sec1 } = await oldData(data1)
                sec1.append(oldDateP)
                sec1.append(oldDateP2)
                sec1.append(oldDateP3)
                div.append(sec1)

                let form2 = document.querySelector(`.inner-habit[name='${data1.habit_id}'] > section > .buttons > .deletion`);

                form2.addEventListener('submit', (e) => {
                    deleteHabit(e)
                })

                if (data1.currfreq === data1.frequency) {
                    document.querySelectorAll(`.inner-habit[name='${data1.habit_id}'] > section > .buttons > .count > input`).forEach(habitCountData => {
                        habitCountData.setAttribute("disabled", "true")
                    })
                }
                
                if (data1.currfreq == 0) {
                    document.querySelectorAll(`.inner-habit[name='${data1.habit_id}'] > section > .buttons > .decrement > input`).forEach(habitCountData => {
                        habitCountData.setAttribute("disabled", "true")
                    })
                }

            });

        } catch (err) {
            console.warn(err)
        }
    }

    function progessBarIncrease(habitFrequency, data) {
        // Just incase the disabling of buttons doesn't work, if the frequency is set to undefined, it will exit the function
        if (data.frequency == undefined) {
            return;
        }
        habitFrequency.setAttribute('value', data.frequency)
    }


    async function oldData(data) {
        const oldDateP = document.createElement("p");
        const oldDateP2 = document.createElement("p");
        const oldDateP3 = document.createElement("p");
        const sec1 = document.createElement("section");

        const old = await fetch(`http://localhost:3000/habits/habits/oldhabits/entries/${data.habit_id}`);
        const oldInfo = await old.json()
        const d = new Date();
        d.setDate(d.getDate() - 1);

        if (oldInfo[0] !== undefined) {
            oldDateP.textContent = `${d.toLocaleDateString('en-GB')}: ${oldInfo[0]} / ${data.frequency}`
        } else {
            oldDateP.textContent = `No past data!`
        }

        const d1 = new Date();
        d1.setDate(d1.getDate() - 2);
        if (oldInfo[1] !== undefined) {
            oldDateP2.textContent = `${d1.toLocaleDateString('en-GB')}: ${oldInfo[1]} / ${data.frequency}`
        }

        const d2 = new Date();
        d2.setDate(d2.getDate() - 3);
        if (oldInfo[2] !== undefined) {
            oldDateP3.textContent = `${d2.toLocaleDateString('en-GB')}: ${oldInfo[2]} / ${data.frequency}`
        }
        return { oldDateP, oldDateP2, oldDateP3, sec1 }
    }

    // makes sure each function is ran when dom is loaded
    window.addEventListener('DOMContentLoaded', async function () {
        await updateData(currentUser())
        await habitlist()

    })


    module.exports = { createHabit, updateData, habitlist, progessBarIncrease, oldData, deleteHabit, updateHabit, currentUsr, currentUser, newHabit }
}

},{"./creation":2,"./habitUpdateDelete":4}],4:[function(require,module,exports){
function currentUser() {
    const username = localStorage.getItem('username')
    return username;
}

async function newHabit(e) {
    e.preventDefault();
    const { habit, frequency } = e.target

    const obj = {
        habit: habit.value,
        frequency: frequency.value
    }

    try {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj)
        }

     
        const r = await fetch(`http://localhost:3000/habits/${currentUser()}`, options)
        const data = await r.json()

        if (data.err) {
            throw Error(data.err)
        }

        window.location.reload()
    } catch (err) {
        console.warn(err);
    }
}

async function deleteHabit(e) {
    e.preventDefault();
    const obj = {
        id: e.target.name
    }     
    try {
        const options = {
            method: 'DELETE',
            headers: new Headers({ 'Authorization': localStorage.getItem('token') }),
            body: JSON.stringify(obj)
        }

        const r = await fetch(`http://localhost:3000/habits/delete/${e.target.name}`, options)
        const data = await r.json()
        if (data.err) {
            throw Error(data.err)

        }

        window.location.reload()

    } catch (err) {
        console.warn(err)
    }
   
}

async function updateHabit(e) {
    try {
        const options = {
            method: 'PUT',
            headers: new Headers({ 'Authorization': localStorage.getItem('token') })
        }

        const updateHabit = await fetch(`http://localhost:3000/habits/update/${e}`, options)
        const data = await updateHabit.json()
        if (data.err) {
            throw Error(data.err)
        }

        window.location.reload()

    } catch (err) {
        console.warn(err)
    }

}

async function decrementHabit(e) {
    // alert("a")
    try {
        const options = {
            method: 'DELETE',
            headers: new Headers({ 'Authorization': localStorage.getItem('token') }),
        }
        const decrementHabit = await fetch(`http://localhost:3000/habits/decrement/${e}`, options);
        const data = await decrementHabit.json()
        if (data.err) {
            throw Error(data.err)
        }
    } catch (err) {
        console.warn(err);
    }

  
}

module.exports = {newHabit, deleteHabit, updateHabit, decrementHabit, currentUser}
},{}],5:[function(require,module,exports){

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
},{"./register":6}],6:[function(require,module,exports){
const {requestLogin} = require('./login');
const regForm = document.querySelector(".register");

async function requestRegistration(e) {
    e.preventDefault();
    const {username, email, password} = e.target
  
    const obj = {
        username: username.value,
        email: email.value,
        password: password.value
    }
    
    try {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj)
        }

        const r = await fetch(`http://localhost:3000/register`, options)
        const data = await r.json()
        if (data.err) { 
            document.querySelector("body > section > .error-reg").textContent = data.err;
            throw Error(data.err) 
        
        } else {
            requestLogin;
            document.querySelector("body > section > .error-reg").textContent = "";
            window.location.href = "login.html"
            
        }
        
    } catch (err) {
        console.warn(err);
    }
}


if (document.querySelector("body > section > .register")) {
    regForm.addEventListener('submit', (e) => {
        requestRegistration(e)
    })
}

module.exports = {requestRegistration};



},{"./login":5}]},{},[1]);
