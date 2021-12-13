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

    describe("submits forms",  () => {
        let evt;

        beforeEach(() => {
            fetch.resetMocks();
            evt =  { preventDefault: jest.fn()}
        })

        it("submit login", async () => {
            await app.login(evt)
           
        })

        it("submit register", async () => {
            await app.register(evt)
           
        })
    })
})