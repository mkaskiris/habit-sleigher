const User = require('../../../model/User');
const Habit = require('../../../model/Habit');

jest.mock('../../../model/User');

const pg = require('pg');
jest.mock('pg');

const db = require('../../../db/db');

const user = {
    user_id: 10,
    username: 'test1',
    emai: 'test1@test.com',
    usr_password: 'testing'
};
const habits = [
    {                
        habit_id: 1,
        habit: 'test_habit',
        user_id: 10,
        currTime: 'current time',
        currfreq: 3,
        frequency: 4
    },
    {                
        habit_id: 2,
        habit: 'test_habit2',
        user_id: 10,
        currTime: 'current time',
        currfreq: 1,
        frequency: 2
    },

]

describe('Habit', () =>{
    beforeEach(() => jest.clearAllMocks())
    
    afterAll(() => jest.resetAllMocks())

    //all
    describe('all', ()=>{
        test('resolves with habits on successful db query', async () =>{
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{}, {}, {}]});
            const all = await Habit.all;
            expect(all).toHaveLength(3)
        })
    })

    //getByName
    describe('getByName', () =>{
        test('', async () =>{
            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: habits});
            let testUser = new User(user);
            const result = await Habit.getByName(testUser.username);
            expect(result).toHaveLength(2);
            expect(result[0]).toHaveProperty('habit', 'test_habit')
        })
    })

    //getOldHabits
    // describe('getOldHabits', () =>{
    //     test('returns an array of old habbits', async () =>{
    //         jest.spyOn(db, 'query').mockResolvedValueOnce({rows:{}});
    //         const result = await Habit.getOldHabits(1);
    //         expect(result).toHaveLength(0)
    //     })
    // })

    //creathabit
    describe('createHabit', () =>{
        test('resolves with habit on successful query', async () =>{
            let habitData = {     
                habit: 'test_habit',
                frequency: 4
            }
            
            jest.spyOn(db, `query`).mockResolvedValueOnce({rows: 'test'}).mockResolvedValueOnce({rows: [{...habitData, habit_id:1 }] })
            const result = await Habit.createHabit(habitData);
            expect(result).toHaveProperty('habit_id')
        })
    })

    // //deltehabit
    // describe('deleteHabit', () =>{
    //     test('', async () =>{
    //         jest.spyOn(db, )
    //     })
    // })

    // //getHabits
    // describe('getHabits', () =>{
    //     test('', async () =>{
    //         jest.spyOn(db, )
    //     })
    // })

    // //createHabitEntry
    // describe('createHabitEntry', () =>{
    //     test('', async () =>{
    //         jest.spyOn(db, )
    //     })
    // })
})