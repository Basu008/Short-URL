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

describe('Integration Test - createUser', () => {
    it('creates a user in DB and returns 201', async () => {
      req.body = {
        username: 'john123',
        password: 'testPASS@123',
        full_name: 'John Doe',
        phone: {
            country_code:"+91",
            number:"9999999999"
        }
      };
      
      await createUser(req, res);
      const userInDb = await User.findOne({ username: 'john123' });
  
      expect(userInDb).not.toBeNull();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, payload: userInDb._id });
    })
  })