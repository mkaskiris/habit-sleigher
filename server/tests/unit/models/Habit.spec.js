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

    //done
    describe('all', ()=>{
        test('resolves with habits on successful db query', async () =>{
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{}, {}, {}]});
            const all = await Habit.all;
            expect(all).toHaveLength(3)
        })
        test('error', async ()=>{
            //expect.assertions(1)tions(1)
            return Habit.all.catch(e=>{
                expect(e).toBe('Error retrieving habits')
            })
        })
    })

    //done
    describe('getByName', () =>{
        test('', async () =>{
            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: habits});
            let testUser = new User(user);
            const result = await Habit.getByName(testUser.username);
            expect(result).toHaveLength(2);
            expect(result[0]).toHaveProperty('habit', 'test_habit')
        })
        test('error', async ()=>{
            //expect.assertions(1)tions(1)
            return Habit.getByName('whatever').catch(e=>{
                expect(e).toBe('Error getting name')
            })
        })

    })

    //done
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
        test('error', async ()=>{
            //expect.assertions(1)tions(1)
            return Habit.createHabit('whatever').catch(e=>{
                expect(e).toBe('Error creating habit')
            })
        })
    })

    //done
    describe('newHabitEntry', () =>{
        test('doesnt go into brnaches', async () =>{
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows:[{frequency:5}]}) //maxFreq
                .mockResolvedValueOnce({})//insert
                .mockResolvedValueOnce({rows:[ { count: 2 } ] })//numofEntries
            const result = await Habit.newHabitEntry(habits[0])
            expect(result).toBe('completion inserted to table');
        })

        test('goes into first branch', async()=>{
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows:[{frequency:5}]}) //maxFreq
                .mockResolvedValueOnce({})//insert
                .mockResolvedValueOnce({rows:[ { count: 1 } ] })//numofEntries
                .mockResolvedValueOnce({rows: [{count: 1}]})
                .mockResolvedValueOnce({})
            const result = await Habit.newHabitEntry(habits[0])
            expect(result).toBe('completion inserted to table');
        })

        test('goes into second branch', async()=>{
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows:[{frequency:5}]}) //maxFreq
                .mockResolvedValueOnce({})//insert
                .mockResolvedValueOnce({rows:[ { count: 5 } ] })//numofEntries
                .mockResolvedValueOnce({})
            const result = await Habit.newHabitEntry(habits[0])
            expect(result).toBe('completion inserted to table');
        })
        test('error', async ()=>{
            //expect.assertions(1)tions(1)
            return Habit.newHabitEntry(habits[0])
                .catch(e => expect(e).toEqual('err'))
        })
    })

    //done
    describe('getHabits', () =>{
        test('goes throug all branches', async ()=>{
            jest.spyOn(db,'query')
                .mockResolvedValueOnce({rows:[{user_id:1}]}) //user_id
                .mockResolvedValueOnce({rows:[{habit_id:1}]}) //userhabitId
                .mockResolvedValueOnce({rows:[{count:0}]}) //completion
                .mockResolvedValueOnce({rows:[{count:2}]}) //habits
                .mockResolvedValueOnce({rows:[{frequency:2}]}) //freq
                .mockResolvedValueOnce({rows:[{currstreak:3}]}) //currstreak
                .mockResolvedValueOnce({rows:[{maxstreak:2}]}) //maxstreak
                .mockResolvedValueOnce({}) //sreak update
                .mockResolvedValueOnce({}) //max streak update
                .mockResolvedValueOnce({}) //update
                .mockResolvedValueOnce({rows:[{user_id:1}]}) //getuser
                .mockResolvedValueOnce({rows:[habits[0]]}) // get data
            const result = await Habit.getHabits(1,'test')
            expect(result.rows[0]).toHaveProperty('habit_id')
        })

        test('throws error', async ()=>{
            //expect.assertions(1)tions(1);
            return Habit.getHabits(1,'test')
                .catch(e => expect(e).toBe('couldnt get habbits'))
        })
    })
    //done
    describe('decrement', () =>{
        test('decrements successfully', async ()=>{
            jest.spyOn(db,'query')
                .mockResolvedValueOnce({rows:[{currfreq:2, frequency:2}]})//currfreq
                .mockResolvedValueOnce({})//update
                .mockResolvedValueOnce({rowCount:2})//decrement
            const result = await Habit.decrement(1)
            expect(result).toBe('1 was decremented!')
        })
        test('fails to decrement', async ()=>{
            jest.spyOn(db,'query')
                .mockResolvedValueOnce({rows:[{currfreq:2, frequency:2}]})//currfreq
                .mockResolvedValueOnce({})//update
                .mockResolvedValueOnce({rowCount:0})//decrement
            const result = await Habit.decrement(1)
            expect(result).toBe('1 could not be decremented!')
        })
        test('error', async ()=>{
            //expect.assertions(1)tions(1);
            return Habit.decrement(1).catch(e=>{
                expect(e).toBe('cannot decrement the counter, try again')
            })
        })
    }) 

    //done
    describe('getOldHabits', () =>{
        test('diff = undefined', async () =>{
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows:[{date_trunc:{}}]})//days
                .mockResolvedValueOnce({rows:[{count: 3}]})//daybefore
                .mockResolvedValueOnce({rows:[{count: 4}]})//day2
                .mockResolvedValueOnce({rows:[{count: 5}]})//day3
            const result = await Habit.getOldHabits(1);
            expect(result).toHaveLength(0)
        })
        test('diff = 1', async () =>{
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows:[{date_trunc:{days:1}}]})//days
                .mockResolvedValueOnce({rows:[{count: 3}]})//daybefore
                .mockResolvedValueOnce({rows:[{count: 4}]})//day2
                .mockResolvedValueOnce({rows:[{count: 5}]})//day3
            const result = await Habit.getOldHabits(1);
            expect(result).toHaveLength(1)
        })
        test('diff = 2', async () =>{
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows:[{date_trunc:{days:2}}]})//days
                .mockResolvedValueOnce({rows:[{count: 3}]})//daybefore
                .mockResolvedValueOnce({rows:[{count: 4}]})//day2
                .mockResolvedValueOnce({rows:[{count: 5}]})//day3
            const result = await Habit.getOldHabits(1);
            expect(result).toHaveLength(2)
        })
        test('diff = 3', async () =>{
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows:[{date_trunc:{days:3}}]})//days
                .mockResolvedValueOnce({rows:[{count: 3}]})//daybefore
                .mockResolvedValueOnce({rows:[{count: 4}]})//day2
                .mockResolvedValueOnce({rows:[{count: 5}]})//day3
            const result = await Habit.getOldHabits(1);
            expect(result).toHaveLength(3)
        })
        test('error', async () =>{
            //expect.assertions(1)tions(1)
            return Habit.getOldHabits(1).catch(e=>{
                expect(e).toBe('error occured')
            })
        })
    })
})