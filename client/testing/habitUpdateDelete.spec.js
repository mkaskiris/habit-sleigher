/**
* @jest-environment jsdom
*/

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

global.fetch = require('jest-fetch-mock');

let app;

describe('New habit, update and delete', () => {
        beforeEach(() => {
            app = require('../js/habitUpdateDelete.js')
            evt =  { preventDefault: jest.fn()}
            
        })
        afterEach(() => {
            fetch.resetMocks();
        })

        it("new habit", async () => {
            const evt = { preventDefault: jest.fn(), target: {habit: "test", frequency: 5}}
            await app.newHabit(evt)
        })

        it("deletes post", async () => {
            const evt= { preventDefault: jest.fn(), target: {name: "test"}}
            await app.deleteHabit(evt)
        })
        it("current user", async () => {
            app.currentUser();
        })
})