/**
* @jest-environment jsdom
*/

const { expect } = require("@jest/globals");
const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");

describe("habit.html", () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    })
    
    describe('head', () => {
        it('has a title', () => {
            const title = document.querySelector('head title');
            expect(title).toBeTruthy();
            expect(title.textContent).toBe("Task")
        })
    })

    
    describe("body", () => {
        describe('header', () => {
            let loggedInNav

            beforeEach(() => {
                loggedInNav = document.querySelector(".loggedInNav");
            })

            it("exists", () => {
                expect(loggedInNav).toBeTruthy();
            })

            // it("has the right title", () => {
            //     expect(heading).toBeTruthy();
            //     expect(heading.textContent).toEqual("HabitSleigher");
            // })
        })
    })
})