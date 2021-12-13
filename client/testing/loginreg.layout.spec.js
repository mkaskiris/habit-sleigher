/**
* @jest-environment jsdom
*/

const { expect } = require("@jest/globals");
const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.resolve(__dirname, "../login.html"), "utf8");

describe("login.html", () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    })
    
    describe('head', () => {
        it('has a title', () => {
            const title = document.querySelector('head title');
            expect(title).toBeTruthy();
            expect(title.textContent).toBe("HabitSleigher")
        })
    })

    
    describe("body", () => {
        describe('header', () => {
            let header, heading

            beforeEach(() => {
                header = document.querySelector("header");
                heading = header.querySelector("h2");
            })

            it("exists", () => {
                expect(header).toBeTruthy();
            })

            it("has the right title", () => {
                expect(heading).toBeTruthy();
                expect(heading.textContent).toEqual("HabitSleigher");
            })
        })

        describe('login form', () => {
            let loginForm, emailInput, passwordInput, submitBtn

            beforeEach(() => {
                loginForm = document.querySelector('#login')
                emailInput = loginForm.querySelector('input[type=email]')
                passwordInput = loginForm.querySelector(('input[type=password]'))
                submitBtn = loginForm.querySelector(('input[type=submit]'))
            })

            it("exists", () => {
                expect(loginForm).toBeTruthy();
            })

            it("has an input for email", () => {
                expect(emailInput).toBeTruthy();
                expect(emailInput.name).toEqual("email")
                expect(emailInput.placeholder).toEqual("email")
            })

            it("has an input for password", () => {
                expect(passwordInput).toBeTruthy();
                expect(passwordInput.name).toEqual("password")
                expect(passwordInput.placeholder).toEqual("password")
            })

            it("has a button to submit form for login", () => {
                expect(submitBtn).toBeTruthy();
                expect(submitBtn.value).toEqual("Login");
            })
        })

        describe('register form', () => {
            let registerForm, usernameInput, emailInput, passwordInput, submitBtn

            beforeEach(() => {
                registerForm = document.querySelector('#register')
                usernameInput = registerForm.querySelector('input[type=text]')
                emailInput = registerForm.querySelector('input[type=email]')
                passwordInput = registerForm.querySelector(('input[type=password]'))
                submitBtn = registerForm.querySelector(('input[type=submit]'))
            })

            it("exists", () => {
                expect(registerForm).toBeTruthy();
            })

            it("has an input for username", () => {
                expect(usernameInput).toBeTruthy()
                expect(usernameInput.name).toEqual("username")
                expect(usernameInput.placeholder).toEqual("username")
            })

            it("has an input for email", () => {
                expect(emailInput).toBeTruthy();
                expect(emailInput.name).toEqual("email")
                expect(emailInput.placeholder).toEqual("email")
            })

            it("has an input for password", () => {
                expect(passwordInput).toBeTruthy();
                expect(passwordInput.name).toEqual("password")
                expect(passwordInput.placeholder).toEqual("password")
            })

            it("has a button to submit form for registering", () => {
                expect(submitBtn).toBeTruthy();
                expect(submitBtn.value).toEqual("Register");
            })
        })
    })
})