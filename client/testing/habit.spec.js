/**
* @jest-environment jsdom
*/

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

global.fetch = require('jest-fetch-mock');

let app;

describe('submit login form', () => {
    

    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        app = require('../js/habit.js')
        
    })

    afterEach(() => {
        fetch.resetMocks();
    })

    describe("data",  () => {
        let evt;
        let data;
        let hiddenForm;
        let habitForm;
        beforeEach(() => {
            fetch.resetMocks();
            evt =  { preventDefault: jest.fn()}
            data = {
                "habit_id": 3,
                "habit": "have breakfast",
                "user_id": 1,
                "currstreak": 1,
                "maxstreak": 0,
                "currtime": "2021-12-13T15:20:29.147Z",
                "currfreq": 0,
                "frequency": 1
            }
            hiddenForm = document.querySelector("body > .hidden_form")
            habitForm = document.querySelector(".task");
            
        })

        afterEach(() => {
            fetch.resetMocks();
        })

        it("gets habit list", async () => {
            await app.habitlist()
        })

        it("Progess bar increase", () => {
            
            let habitFrequency = document.createElement('progress')
            app.progessBarIncrease(habitFrequency, data)
        })
        
        it("updates data",  async() => {
            // fetch.mockResponse(() => app.updateData().then(res => res.json()))
            app.updateData("test")
        })

        it ("Old date displays", async () => {
            
            app.oldData("test")
        })

        it("checks current user", () => {
            app.currentUsr()
        
        })
    })

})