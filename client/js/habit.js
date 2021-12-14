const habitForm = document.querySelector(".task");


function currentUser() {
    const username = localStorage.getItem('username')
    return username;
}

if (document.querySelector("body > .hidden_form")) {

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

    async function updateData() {
        const options = {
            headers: new Headers({ 'Authorization': localStorage.getItem('token') }),
        }
        const getId = await fetch(`http://localhost:3000/habits/${currentUser()}`, options);
        const getIdData = await getId.json();

        getIdData.forEach(async data => {
            const getHabitCount = await fetch(`http://localhost:3000/habits/habits/${data.habit_id}/${currentUser()}`)
            const habitCountData = await getHabitCount.json()
            
            
        })
    }
    async function habitlist() {
        try {
            const getHabitCount = await fetch(`http://localhost:3000/habits/habits/0/${currentUser()}`)
            const habitCountData = await getHabitCount.json()

            habitCountData.forEach(async data1 => {
                
                const {input1, div, habitFrequency} = await createHabit(data1)
                
                input1.addEventListener('click', async (e) => {
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

                const {oldDateP, oldDateP2, oldDateP3, sec1} = await oldData(data1)
                sec1.append(oldDateP)
                sec1.append(oldDateP2)
                sec1.append(oldDateP3)
                div.append(sec1)
                
                let form2 = document.querySelector(`.inner-habit[name='${data1.habit_id}'] > section > .buttons > .deletion`);

                form2.addEventListener('submit',  (e) => {
                    deleteHabit(e)
                })

                if (data1.currfreq === data1.frequency) {
                    document.querySelectorAll(`.inner-habit[name='${data1.habit_id}'] > section > .buttons > .count > input`).forEach(habitCountData => {
                        habitCountData.setAttribute("disabled", "true")
                    })
                }
            
                });

        } catch (err) {
            console.warn(err)
        }
    }

    // async function updateOldStreak(data1) {
    //     history.pushState({}, "", "")
    //     const options = {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(data1)
    //     }
    //     // const options = {
    //     //     headers: new Headers({ 'Authorization': localStorage.getItem('token') }),
    //     // }

    //     const fetchOldStreaks = await fetch(`http://localhost:3000/habits/oldstreaks/${data1.habit_id}`, options);
    //     const getData = await fetchOldStreaks.json();
    //     return getData
    // }

    

    async function createHabit(data1) {
        
        const sec = document.querySelector("body > .habit-list");
        const div = document.createElement("div");
        const div2 = document.createElement("div")
        const div3 = document.createElement("div")
        const div4 = document.createElement("div")
        const h2 = document.createElement("h2");
        const p2 = document.createElement("p");
        const p3 = document.createElement("p");
        const form = document.createElement("form")
        const input = document.createElement("input");
        const form1 = document.createElement("form");
        const input1 = document.createElement("input");
        const section = document.createElement("section")

        let habitFrequency = document.createElement('progress')
        p2.textContent = `${data1.currfreq} / ${data1.frequency}`
        // p3.textContent = `Current Streak: ${data1.currstreak}, Max Streak: ${data1.maxstreak}`
        p3.textContent = `Your best streak: ${data1.currstreak}`
        habitFrequency.setAttribute('max', data1.frequency)
        habitFrequency.setAttribute('value', data1.currfreq)
        div4.setAttribute("class", "leftOver")
        div4.append(habitFrequency)
        div4.append(p2)
        div4.append(p3)

        div.setAttribute("class", "inner-habit")
        div.setAttribute("name", data1.habit_id)
        
        form.setAttribute("name", data1.habit_id);
        form.setAttribute("class", "deletion")
        
        h2.textContent = `${data1.habit}`
        div2.setAttribute("class", "name")
        div2.append(h2)
        
        form1.setAttribute("name", data1.habit_id)
        form1.setAttribute("class", "count")
        
        input1.setAttribute("value", "Count")
        input1.setAttribute("type", "submit")
        form1.append(input1)

        input.setAttribute("value", "DELETE")
        input.setAttribute("type", "submit")
        form.append(input)

        div3.setAttribute("class", "buttons")
        div3.append(form1)
        div3.append(form)

        section.append(div2)
        section.append(div4)
        section.append(div3)
        div.append(section)

        sec.append(div)
        return {input1, div}
    }

    function progessBarIncrease(habitFrequency, data, habitFrequency) {
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
        d.setDate(d.getDate()-1);
     
        if (oldInfo[0] !== undefined) {
            oldDateP.textContent = `${d.toLocaleDateString('en-GB')}: ${oldInfo[0]} / ${data.frequency}`
        } else {
            oldDateP.textContent = `No past data!`
        }

        const d1 = new Date();
        d1.setDate(d1.getDate()-2);
        if (oldInfo[1] !== undefined) {
        oldDateP2.textContent = `${d1.toLocaleDateString('en-GB')}: ${oldInfo[1]} / ${data.frequency}`
        }

        const d2 = new Date();
        d2.setDate(d2.getDate()-3);
        if (oldInfo[2] !== undefined) {
        oldDateP3.textContent = `${d2.toLocaleDateString('en-GB')}: ${oldInfo[2]} / ${data.frequency}`
        }
        return {oldDateP, oldDateP2, oldDateP3, sec1}
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

            const r = await fetch(`http://localhost:3000/habits/update/${e}`, options)
            const data = await r.json()
            if (data.err) {
                throw Error(data.err)

            }

            window.location.reload()

        } catch (err) {
            console.warn(err)
        }

    }


    // makes sure each function is ran when dom is loaded
    window.addEventListener('DOMContentLoaded', async function () {
        await updateData()
        await habitlist()
        
    })
    
    


}
