const bcrypt = require('bcryptjs');

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
        const res = await request(api).get('/habits/')
        expect(res.statusCode).toEqual(200)
        expect(res.body.length).toEqual(3);
    })
})