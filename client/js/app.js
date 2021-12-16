const {currentUser, logout} = require('./main');

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








