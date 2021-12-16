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

        it("logouts", () => {
            app.logout();
        })

        it("submit login", async () => {
            await app.login(evt)
           
        })

        it("submit register", async () => {
            await app.register(evt)
           
        })

        it ("Login user", async () => {
            app.loginUser({email: 'test@gmail.com', password: 'test'})
        })
    })

    describe("show form", () => {
        beforeEach(() => {
            fetch.resetMocks();
            evt =  { preventDefault: jest.fn(), target: {className: " w3-border-light-green", id: "register-link"} }
        })

        it("show form", () => {
            const form = document.createElement("form");
            form.setAttribute("id", "register")
            form.style.display = "block"
            app.showForm(evt)

            expect(form.style.display).toBe("block")
        })
    })
})