const mockSend = jest.fn();
const mockJson = jest.fn();
const mockNext = jest.fn();
const mockStatus = jest.fn(code => ({ send: mockSend, json: mockJson, end: jest.fn() }))
const mockRes = { status: mockStatus }

const jwt = require('jsonwebtoken')
const auth = require('../../../middleware/auth')

//needs fixing
describe('verifyToken', ()=>{
    test('verifies token', async (done)=>{
        const mockReq = {headers:{authorization: 'bear hellow'}}
        jest.spyOn(jwt, 'verify')
            .mockReturnValue({verified:true})
        const result = auth.verifyToken(mockReq, mockRes);
        expect(mockStatus).toHaveBeenCalledWith(200);
    })
})