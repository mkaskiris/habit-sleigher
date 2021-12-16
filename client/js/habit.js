const { newHabit, deleteHabit, decrementHabit } = require('./habitUpdateDelete')
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

                const { hr, oldDateP, oldDateP2, oldDateP3, sec1 } = await oldData(data1)
                sec1.append(hr)
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
        const hr = document.createElement("hr")
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
        return { hr, oldDateP, oldDateP2, oldDateP3, sec1 }
    }

    // makes sure each function is ran when dom is loaded
    window.addEventListener('DOMContentLoaded', async function () {
        await updateData(currentUser())
        await habitlist()

    })


    module.exports = { createHabit, updateData, habitlist, progessBarIncrease, oldData, deleteHabit, currentUsr, currentUser, newHabit }
}
