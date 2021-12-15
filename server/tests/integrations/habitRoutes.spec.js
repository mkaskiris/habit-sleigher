const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../middleware/auth', ()=>{
    return jest.fn((req,res)=>{
        res.end()
    })
});
const auth = require('../../middleware/auth');
describe('habit endpoints', ()=>{
    let api;
    beforeEach(async () => {
        await resetTestDB()
    });

    beforeAll(async () => {
        api = app.listen(5000, () => console.log('Test server running on port 5000'))
    });

    afterAll(async () => {
        console.log('Gracefully stopping test server')
        await api.close()
    })

    it('return a list of all habits in db', async () =>{
        // jest.spyOn(auth, 'verifyToken')
        //     .mockImplementation(()=>true)
        // jest.spyOn(auth, 'verifyToken')
        //     .mockImplementation((req,res,next)=> (next()))
        const res = await request(api).get('/habits/').set({authrorization:'hello there'})
        expect(res.statusCode).toEqual(200)
        expect(res.body.length).toEqual(3);
    })


})