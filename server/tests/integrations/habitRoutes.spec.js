const bcrypt = require('bcryptjs');
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
    
    it('/:name', async () =>{
        //needs middleware
    })

    it('/:username', async ()=>{
        let authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjM5NTgyNTc2fQ.Rocg5YEBb0LeddFAi6FEXkZCbCabwu4dVn0QC-yUPtw"

       const res = await request(api)
            .post('/habits/test2').set('Authorization','Bearer '+ authToken)
            .send({
                habit:'testing habit',
                frequency: '2'
            })
        expect(res.statusCode).toEqual(201);
    })

    it("/", async () => {
        // jest.spyOn(auth, 'verifyToken').mockImplementation(() => Promise.resolve());
        jest.spyOn(auth, 'verifyToken').mockImplementation((req, res, next) => next());
        let authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjM5NTgyNTc2fQ.Rocg5YEBb0LeddFAi6FEXkZCbCabwu4dVn0QC-yUPtw"
        const res = await request(api).get('/habits').set('Authorization','Bearer '+ authToken)
        expect(res.statusCode).toEqual(200)
        expect(res.body.length).toEqual(6)
    })

})