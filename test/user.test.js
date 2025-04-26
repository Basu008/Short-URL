const Config = require("../server/config/testConfig")
const {setupMongoDBConnection, closeMongoConnection} = require("../server/mongodb/mongodb")
setupMongoDBConnection(Config.database)
const { createUser, loginUser } = require('../app/signup');
const User = require('../model/user');

let req, res;

afterEach(async () => {
    await User.deleteMany({})
  })

afterAll(async () => {
    await closeMongoConnection()
})

beforeEach(() => {
    req = {body:{}}
    res = {
        status: jest.fn().mockReturnThis(),
        json:jest.fn()
    }
})

describe('create user', () => {
    it('creates a user in DB and returns user_id', async () => {
      req.body = {
        username: 'john123',
        password: 'testPASS@123',
        full_name: 'John Doe',
        phone: {
            country_code:"+91",
            number:"9999999999"
        }
      };
      
      await createUser(req, res)
      const userInDb = await User.findOne({ username: 'john123' });
  
      expect(userInDb).not.toBeNull()
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({ success: true, payload: userInDb._id })
    })

    it('if any field is missing, returns error', async () => {
        req.body = {
            username: 'john123',
            password: 'testPASS@123',
            phone: {
                country_code:"+91",
                number:"9999999999"
            }
        };
        await createUser(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        const callArg = res.json.mock.calls[0][0]
        expect(callArg.success).toBe(false)
    })

    it('if username is invalid, returns error', async () => {
        req.body = {
            username: 'joh',
            password: 'testPASS@123',
            full_name: 'John Doe',
            phone: {
                country_code:"+91",
                number:"9999999999"
            }
        };
        await createUser(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        const callArg = res.json.mock.calls[0][0]
        expect(callArg.success).toBe(false)
    })

    it('if password is weak, returns error', async () => {
        req.body = {
            username: 'john123',
            password: 'test',
            full_name: 'John Doe',
            phone: {
                country_code:"+91",
                number:"9999999999"
            }
        };
        await createUser(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        const callArg = res.json.mock.calls[0][0]
        expect(callArg.success).toBe(false)
    })
  })

describe('login user', () => {
    it('logs in the user', async () => {
        req.body = {
            username: 'john123',
            password: 'testPASS@123',
            full_name: 'John Doe',
            phone: {
                country_code:"+91",
                number:"9999999999"
            }
          };
          await createUser(req, res)
        //   console.log(await User.findOne({}))
          res.status.mockClear()
          res.json.mockClear()
          req.body = {
            username: 'john123',
            password: 'testPASS@123'
          }
          await loginUser(req, res)
          expect(res.status).toHaveBeenCalledWith(200)
          expect(res.json).toHaveBeenCalled()
          const callArg = res.json.mock.calls[0][0]
          expect(callArg.success).toBe(true)
          expect(callArg.payload.username).toBe('john123')
    })

    it('if password is incorrect, returns error', async () => {
        req.body = {
            username: 'john123',
            password: 'testPASS@123',
            full_name: 'John Doe',
            phone: {
                country_code:"+91",
                number:"9999999999"
            }
          };
          await createUser(req, res)
          res.status.mockClear()
          res.json.mockClear()
          req.body = {
            username: 'john123',
            password: 'testPASS@23'
          }
          await loginUser(req, res)
          expect(res.status).toHaveBeenCalledWith(400)
          expect(res.json).toHaveBeenCalledWith({success:false, error:"incorrect passoword"})
    })

    it('if username is incorrect, returns error', async () => {
        req.body = {
            username: 'john123',
            password: 'testPASS@123',
            full_name: 'John Doe',
            phone: {
                country_code:"+91",
                number:"9999999999"
            }
          };
          await createUser(req, res)
        //   console.log(await User.findOne({}))
          res.status.mockClear()
          res.json.mockClear()
          req.body = {
            username: 'john12',
            password: 'testPASS@123'
          }
          await loginUser(req, res)
          expect(res.status).toHaveBeenCalledWith(400)
          expect(res.json).toHaveBeenCalledWith({success:false, error:"incorrect username"})
    })
})