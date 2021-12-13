/**
* @jest-environment jsdom
*/

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../login.html'), 'utf8');

global.fetch = require('jest-fetch-mock');
let app;

describe('submit login form', () => {
    

    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        app = require('../js/main.js')
    })

    afterEach(() => {
        fetch.resetMocks();
    })

    describe("submits form",  () => {
        let evt;

        beforeEach(() => {
            fetch.resetMocks();
            evt =  { preventDefault: jest.fn()}
        })
        it("gets data", async () => {
            await app.login(evt)
           
        })
    })
})