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


