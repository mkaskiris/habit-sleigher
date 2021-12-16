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
    describe('getOldHabits', () =>{
        test('returns an array of old habbits', async () =>{
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows:[{date_trunc:{days:3}}]})
                .mockResolvedValueOnce({rows:[{count: 3}]})
                .mockResolvedValueOnce({rows:[{count: 4}]})
                .mockResolvedValueOnce({rows:[{count: 5}]})
            const result = await Habit.getOldHabits(1);
            expect(result).toHaveLength(3)
        })
    })

    //creathabit
    describe('createHabit', () =>{
        test('resolves with habit on successful query', async () =>{
            let habitData = {     
                habit: 'test_habit',
                frequency: 4
            }
            
            jest.spyOn(db, `query`)
                .mockResolvedValueOnce({rows: 'test'})
                .mockResolvedValueOnce({rows: [{...habitData, habit_id:1 }] })
            const result = await Habit.createHabit(habitData);
            expect(result).toHaveProperty('habit_id')
        })
    })

    // //deltehabit - prolly dont need here
    // describe('deleteHabit', () =>{
    //     test('', async () =>{
    //         jest.spyOn(db, )
    //     })
    // })

    // //getHabits
    // describe('getHabits', () =>{
    //     test('resolves with updated habit currfreq no habitid', async () =>{
    //         const testHabit = {                
    //             habit_id: 1,
    //             habit: 'drink water',
    //             user_id: 1,
    //             currfreq: 4,
    //             frequency: 4
    //         }

    //         jest.spyOn(db, 'query')
    //             .mockResolvedValueOnce({rows: [3]}) //currfreq
    //             .mockResolvedValueOnce({}) //update
    //             .mockResolvedValueOnce({rows: [10]}) //yesterday
    //             .mockResolvedValueOnce({rows: [5]}) //today
    //             .mockResolvedValueOnce({rows: []}) //habitid
    //             //.mockResolvedValueOnce({}) //if update
    //             .mockResolvedValueOnce({rows: [{user_id: 1}]}) //getuser
    //             .mockResolvedValueOnce({rows: [testHabit]}) //getHabitData
    //         const result = await Habit.getHabits(1, 'test')
    //         expect(result.rows[0]).toHaveProperty('currfreq',4);
    //     })

    //     test('resolves with updated habit currfreq no streak', async () =>{
    //         const testHabit = {                
    //             habit_id: 1,
    //             habit: 'drink water',
    //             user_id: 1,
    //             currfreq: 4,
    //             frequency: 4
    //         }

    //         jest.spyOn(db, 'query')
    //             .mockResolvedValueOnce({rows: [3]}) //currfreq
    //             .mockResolvedValueOnce({}) //update
    //             .mockResolvedValueOnce({rows: []}) //yesterday
    //             .mockResolvedValueOnce({rows: []}) //today
    //             .mockResolvedValueOnce({rows: [1]}) //habitid
    //             .mockResolvedValueOnce({}) //if update
    //             .mockResolvedValueOnce({rows: [{user_id: 1}]}) //getuser
    //             .mockResolvedValueOnce({rows: [testHabit]}) //getHabitData
    //         const result = await Habit.getHabits(1, 'test')
    //         expect(result.rows[0]).toHaveProperty('currfreq',4);
    //     })
     
    // })

    // //createHabitEntry --needs fixing
    describe('newHabitEntry', () =>{
        test('resolves with new habit entry with >1 less count', async () =>{
            const data = { habit_id: 3, date: '12/15/2021, 4:41:58 PM' }
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows: [{frequency: 5}]})
                .mockResolvedValueOnce({})
                .mockResolvedValueOnce({rows: [{count: 2}]})
                // .mockResolvedValueOnce({rows: [habits[0]]})
            
            const result = await Habit.newHabitEntry(habits[0])
            expect(result).toBe("completion inserted to table")
            // expect(result).toHaveProperty('habit_id',1);
        })

        // test('error', async () => {
        //     jest.spyOn(db, "query")
        //         .mockResolvedValueOnce({rows: []})
        //     const result = await Habit.newHabitEntry(habits[0])
        //     expect(result).toEqual('error')
        // })
        // test('resolves with new habit entry with 1 less count', async()=>{

        // })
    })
})