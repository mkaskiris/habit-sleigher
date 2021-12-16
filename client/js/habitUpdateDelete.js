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

async function decrementHabit(e) {
    
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

module.exports = {newHabit, deleteHabit, decrementHabit, currentUser, decrementHabit}