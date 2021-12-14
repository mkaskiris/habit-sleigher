/**
* @jest-environment jsdom
*/

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

global.fetch = require('jest-fetch-mock');

let app;

describe('Creation habit', () => {
    

    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        evt =  { preventDefault: jest.fn()}
        app = require('../js/creation.js')
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
        
    })

    afterEach(() => {
        fetch.resetMocks();
    })

    it("create a habit", async () => {
        await app.createHabit(data)
       
    })
})
    

        