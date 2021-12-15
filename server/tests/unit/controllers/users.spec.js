const userController = require('../../../controllers/user')
const User = require('../../../model/User');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(code => ({ send: mockSend, json: mockJson }))
const mockRes = { status: mockStatus }

const db = require('../../../db/db');
const bcrypt = require('bcryptjs');

describe('users controller', () => {
    beforeEach(() =>  jest.clearAllMocks());

    afterAll(() => jest.resetAllMocks());

    describe('index', ()=>{
        test('returns all users with status 200', async ()=>{
            jest.spyOn(User, 'all', 'get')
                .mockResolvedValue([{}, {}, {}])
            await userController.index(null, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith([{},{},{}]);
        })
    })

    describe('find', () =>{
        test('returns 201 if user found', async ()=>{
            let testUser = {
                user_id: 'testing',
                username: 'test_usr',
                email: 'test:test.com',
                usr_password: '123'
            }

            jest.spyOn(User, 'exists')
                .mockResolvedValue({rows:[testUser]})

            const mockReq = {params: {username: 'test_usr'}}
            await userController.find(mockReq, mockRes)
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith({msg:'User found'});
        })

        test('returns 404 if user not found', async ()=>{
            
            jest.spyOn(User, 'exists')
                .mockResolvedValue({rows: []})

            const mockReq = {params: {username: 'test_usr'}}
            await userController.find(mockReq, mockRes)
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({msg:'No user!'})  
        })
    })

    describe('register', ()=>{
        test('returns 201 if registration was successful', async ()=>{
            let testUser = {
                username: 'test_usr',
                email: 'test:test.com',
                usr_password: '123'
            }

            jest.spyOn(db, 'query')
                .mockResolvedValue({rows: []})
                .mockResolvedValue({rows: []});

            jest.spyOn(User, 'register')
                .mockResolvedValue(new User({testUser, user_id:1}))
            const mockReq = {body: {password: 'hello'}}
            await userController.register(mockReq, mockRes)
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith({msg:'User created'})
        })

        test('returns error if user alread exists', async ()=>{
            let testUser = {
                username: 'test_usr',
                email: 'test@test.com',
                usr_password: '123'
            }

            jest.spyOn(User, 'register')
                .mockRejectedValueOnce(`Error creating user`)
            const mockReq = {body: {password: 'hello'}}
            await userController.register(mockReq, mockRes)
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({err:'Username or email already exists!'})
        })
    })

    describe('login', ()=>{
        test('returns 401 on failed login', async ()=>{
            let testUser = {
                user_id: 'testing',
                username: 'test_usr',
                email: 'test:test.com',
                usr_password: '123'
            }
            jest.spyOn(User, 'findByEmail')
                .mockResolvedValue(new User(testUser));
            
            jest.spyOn(bcrypt, 'compare')
                .mockResolvedValue(false);
            
            const mockReq = {body: {email:'test@test.com'}}
            await userController.login(mockReq,mockRes)
            expect(mockStatus).toHaveBeenCalledWith(401);
            //expect(mockJson).toHaveBeenCalledWith("[Error: User could not be authenticated]")
        })

        test('returns 200 on login', async ()=>{
            let testUser = {
                user_id: 'testing',
                username: 'test_usr',
                email: 'test@test.com',
                usr_password: '123'
            }
            jest.spyOn(User, 'findByEmail')
                .mockResolvedValueOnce(new User(testUser));
            
            jest.spyOn(bcrypt, 'compare')
                .mockResolvedValueOnce(true);
            
            const mockReq = {body: {email:'test@test.com'}}
            await userController.login(mockReq,mockRes)
            expect(mockStatus).toHaveBeenCalledWith(200);
            //expect(mockJson).toHaveBeenCalledWith(`error`);
        })
    })
})

