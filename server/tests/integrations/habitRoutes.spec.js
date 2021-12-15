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

    //needs middle ware
    it('/', async () =>{
        
        // jest.spyOn(auth, 'verifyToken')
        //     .mockImplementation((req,res,next)=> (next()))
        // const res = await request(api).get('/habits')//.auth('test@gmail.com', 'test')
        // expect(res.statusCode).toEqual(200)
        // expect(res.body.length).toEqual(3);
    })
    
    it('/:name', async () =>{
        //needs middleware
    })

    it('/:username', async ()=>{
       const res = await request(api)
            .post('/test2')
            .send({
                habit:'testing habit',
                frequency: '2'
            })
        expect(res.statusCode).toEqual(201);
    })


})