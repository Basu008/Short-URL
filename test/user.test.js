jest.setTimeout(20000);

const Config = require("../server/config/testConfig")
const { setupMongoDBConnection, closeMongoConnection } = require("../server/mongodb/mongodb")
setupMongoDBConnection(Config.database)
const { createUser, loginUser } = require('../app/signup');
const { getUser, updateUser } = require('../app/user');
const User = require('../model/user');

let req, res;

afterEach(async () => {
    await User.deleteMany({})
})

afterAll(async () => {
    await closeMongoConnection()
})

beforeEach(() => {
    req = { body: {} }
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    }
})

describe('create user', () => {
    it('creates a user in DB and returns user_id', async () => {
        req.body = {
            username: 'john123',
            password: 'testPASS@123',
            full_name: 'John Doe',
            phone: {
                country_code: "+91",
                number: "9999999999"
            }
        };

        await createUser(req, res)
        const userInDb = await User.findOne({ username: 'john123' });

        expect(userInDb).not.toBeNull()
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({ success: true, payload: userInDb._id })
    })

    it('returns error if any field is missing', async () => {
        req.body = {
            username: 'john123',
            password: 'testPASS@123',
            phone: {
                country_code: "+91",
                number: "9999999999"
            }
        };
        await createUser(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        const callArg = res.json.mock.calls[0][0]
        expect(callArg.success).toBe(false)
    })

    it('returns error if username is invalid', async () => {
        req.body = {
            username: 'joh',
            password: 'testPASS@123',
            full_name: 'John Doe',
            phone: {
                country_code: "+91",
                number: "9999999999"
            }
        };
        await createUser(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        const callArg = res.json.mock.calls[0][0]
        expect(callArg.success).toBe(false)
    })

    it('returns error if password is weak', async () => {
        req.body = {
            username: 'john123',
            password: 'test',
            full_name: 'John Doe',
            phone: {
                country_code: "+91",
                number: "9999999999"
            }
        };
        await createUser(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        const callArg = res.json.mock.calls[0][0]
        expect(callArg.success).toBe(false)
    })
})

describe('login user', () => {
    it('logs in the user, returns user\'s data', async () => {
        req.body = {
            username: 'john123',
            password: 'testPASS@123',
            full_name: 'John Doe',
            phone: {
                country_code: "+91",
                number: "9999999999"
            }
        };
        await createUser(req, res)
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

    it('checks if password is correct, returns error if not', async () => {
        req.body = {
            username: 'john123',
            password: 'testPASS@123',
            full_name: 'John Doe',
            phone: {
                country_code: "+91",
                number: "9999999999"
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
        expect(res.json).toHaveBeenCalledWith({ success: false, error: "incorrect passoword" })
    })

    it('checks if username is correct, returns error if not', async () => {
        req.body = {
            username: 'john123',
            password: 'testPASS@123',
            full_name: 'John Doe',
            phone: {
                country_code: "+91",
                number: "9999999999"
            }
        };
        await createUser(req, res)
        res.status.mockClear()
        res.json.mockClear()
        req.body = {
            username: 'john12',
            password: 'testPASS@123'
        }
        await loginUser(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ success: false, error: "incorrect username" })
    })
})

describe('get user', () => {
    it('returns user data if it exists in DB', async () => {
        req.body = {
            username: 'john123',
            password: 'testPASS@123',
            full_name: 'John Doe',
            phone: {
                country_code: "+91",
                number: "9999999999"
            }
        };
        await createUser(req, res)
        const userInDb = await User.findOne({ username: 'john123' });
        expect(userInDb).not.toBeNull()
        res.status.mockClear()
        res.json.mockClear()
        req.user_id = userInDb._id
        await getUser(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        const callArg = res.json.mock.calls[0][0]
        expect(callArg.success).toBe(true)
        expect(callArg.payload.username).toBe('john123')
    })

    it('returns error if user\'s data doesn\t exists in DB', async () => {
        req.user_id = "67f81ff2af9fc8fafe6c30c3"
        await getUser(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ success: false, error: "no user found" })
    })
})

describe('edit user', () => {
    it('edits the user in DB, returns success', async () => {
        req.body = {
            username: 'john123',
            password: 'testPASS@123',
            full_name: 'John Doe',
            phone: {
                country_code: "+91",
                number: "9999999999"
            }
        };
        await createUser(req, res)
        const userInDb = await User.findOne({ username: 'john123' });
        expect(userInDb).not.toBeNull()
        res.status.mockClear()
        res.json.mockClear()
        req.user_id = userInDb._id
        req.body = {
            full_name: "Leo messi",
            plan: "PREMIUM"
        }
        await updateUser(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        const callArg = res.json.mock.calls[0][0]
        expect(callArg.success).toBe(true)
        expect(callArg.payload.full_name).toBe('Leo messi')
        expect(callArg.payload.plan).toBe('PREMIUM')
    })

    it('returns error if no field(s) exists in request body', async () => {
        await updateUser(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ success: false, error: "no valid fields provided to update." })
    })

    it('returns error if invalid field(s) exists in request body', async () => {
        req.body = {
            phone: {
                country_code: "+91",
                number: "8888888888"
            }
        }
        await updateUser(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ success: false, error: "no valid fields provided to update." })
    })

    it('returns error if given plan is invalid', async () => {
        req.body = {
            plan: "SILVER"
        }
        await updateUser(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ success: false, error: "plan can be FREE or PREMIUM" })
    })

    it('returns error if user doesn\'t exists in DB', async () => {
        req.user_id = "67f81ff2af9fc8fafe6c30c3"
        req.body = {
            full_name: "Leo messi",
            plan: "PREMIUM"
        }
        await updateUser(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ success: false, error: "no user found" })
    })
})