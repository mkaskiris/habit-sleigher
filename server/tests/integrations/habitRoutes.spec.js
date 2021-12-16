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
        let authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjM5NTgyNTc2fQ.Rocg5YEBb0LeddFAi6FEXkZCbCabwu4dVn0QC-yUPtw"
        const res = await request(api)
            .get('/habits/test')
            .set('Authorization','Bearer '+ authToken)
        expect(res.statusCode).toBe(200)
    })

    it('/:username', async ()=>{
        let authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjM5NTgyNTc2fQ.Rocg5YEBb0LeddFAi6FEXkZCbCabwu4dVn0QC-yUPtw"

       const res = await request(api)
            .post('/habits/test2')
            .set('Authorization','Bearer '+ authToken)
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

    it('/habits/:habit_id/:username', async ()=>{
        const res = await request(api)
            .get('/habits/habits/1/test')
        expect(res.statusCode).toEqual(201)
        expect(res.body.length).toEqual(3)
    })

    it('/habits/oldhabits/entries/:id', async ()=>{
        const res = await request(api)
            .get('/habits/habits/oldhabits/entries/1')
        expect(res.statusCode).toEqual(200)
        expect(res.body.length).toEqual(2)
    })

    it('/:username/habits/entries', async ()=>{
        const res = await request(api)
            .post('/habits/test/habits/entries')
            .send({
                habit_id: 1,
                habit:'testing',
                frequency:2
            })
        expect(res.statusCode).toEqual(201)
    })

    it('deletes habit', async ()=>{
        jest.spyOn(auth, 'verifyToken').mockImplementation((req, res, next) => next());
        let authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjM5NTgyNTc2fQ.Rocg5YEBb0LeddFAi6FEXkZCbCabwu4dVn0QC-yUPtw"

        const res1 = await request(api)
            .delete('/habits/delete/1')
            .set('Authorization','Bearer '+ authToken)
        
        const res = await request(api)
            .get('/habits')
            .set('Authorization','Bearer '+ authToken)
        expect(res1.statusCode).toBe(202)
        expect(res.body.length).toBe(5)
    })

    it('should decrement completion', async()=>{
        const res = await request(api)
            .delete('/habits/decrement/2')
        
        expect(res.statusCode).toEqual(204)
    })


})