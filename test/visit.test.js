jest.setTimeout(20000)

const mongoose = require("mongoose")
const Config = require("../server/config/testConfig")
const { setupMongoDBConnection, closeMongoConnection } = require("../server/mongodb/mongodb")
setupMongoDBConnection(Config.database)

const { addURLVisit, getVisits, getURLVisits, getVisitsCount, getURLVisitsCount } = require('../app/visit')
const Visit = require('../model/visit')

let req, res

afterEach(async () => {
    await Visit.deleteMany({})
})

afterAll(async () => {
    await closeMongoConnection()
})

beforeEach(() => {
    req = { body: {}, params: {}, query: {}, headers: {}, connection: {}, device: { type: 'desktop' } }
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    }
})

describe('add url visit', () => {
    it('adds a visit entry to the database', async () => {
        const result = await addURLVisit('short123', 'IN', 'desktop')
        const visitInDb = await Visit.findOne({ short_id: 'short123' })

        expect(result).toBe(true)
        expect(visitInDb).not.toBeNull()
        expect(visitInDb.origin).toBe('IN')
        expect(visitInDb.device).toBe('desktop')
    })

    it('throws error if visit cannot be added', async () => {
        try {
            await addURLVisit(null, 'IN', 'desktop')
        } catch (error) {
            expect(error).toBeInstanceOf(Error)
        }
    })
})

describe('get visits count', () => {
    it('returns total number of visits for a user', async () => {
        const userId = new mongoose.Types.ObjectId()
        await Visit.create({ short_id: 'short123', user_id: userId, origin: 'IN', device: 'desktop' })

        req.user_id = userId
        await getVisitsCount(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        const callArg = res.json.mock.calls[0][0]
        expect(callArg.success).toBe(true)
        expect(typeof callArg.payload).toBe('number')
        expect(callArg.payload).toBeGreaterThanOrEqual(1)
    })
})

describe('get visits', () => {
    it('returns paginated visits for a user', async () => {
        const userId = new mongoose.Types.ObjectId()
        await Visit.create({ short_id: 'short123', user_id: userId, origin: 'IN', device: 'desktop' })
        await Visit.create({ short_id: 'short456', user_id: userId, origin: 'US', device: 'mobile' })

        req.user_id = userId
        req.query.page = 0

        await getVisits(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        const callArg = res.json.mock.calls[0][0]
        expect(callArg.success).toBe(true)
        expect(Array.isArray(callArg.payload)).toBe(true)
    })

    it('returns filtered visits by device and origin', async () => {
        const userId = new mongoose.Types.ObjectId()
        await Visit.create({ short_id: 'short123', user_id: userId, origin: 'IN', device: 'desktop' })
        await Visit.create({ short_id: 'short123', user_id: userId, origin: 'US', device: 'mobile' })

        req.user_id = userId
        req.query.device = 'desktop'
        req.query.origin = 'IN'

        await getVisits(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        const callArg = res.json.mock.calls[0][0]
        expect(callArg.success).toBe(true)
        expect(callArg.payload.length).toBe(1)
        expect(callArg.payload[0].device).toBe('desktop')
    })
})

describe('get url visits', () => {
    it('returns paginated visits for a specific short url', async () => {
        const userId = new mongoose.Types.ObjectId()
        const shortID = 'short123'
        await Visit.create({ short_id: shortID, user_id: userId, origin: 'IN', device: 'desktop' })
        await Visit.create({ short_id: shortID, user_id: userId, origin: 'US', device: 'mobile' })

        req.user_id = userId
        req.params.shortID = shortID
        req.query.page = 0

        await getURLVisits(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        const callArg = res.json.mock.calls[0][0]
        expect(callArg.success).toBe(true)
        expect(Array.isArray(callArg.payload)).toBe(true)
        expect(callArg.payload.length).toBe(2)
    })

    it('returns filtered visits for a short url', async () => {
        const userId = new mongoose.Types.ObjectId()
        const shortID = 'short123'
        await Visit.create({ short_id: shortID, user_id: userId, origin: 'IN', device: 'desktop' })
        await Visit.create({ short_id: shortID, user_id: userId, origin: 'US', device: 'mobile' })

        req.user_id = userId
        req.params.shortID = shortID
        req.query.device = 'desktop'

        await getURLVisits(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        const callArg = res.json.mock.calls[0][0]
        expect(callArg.success).toBe(true)
        expect(callArg.payload.length).toBe(1)
        expect(callArg.payload[0].device).toBe('desktop')
    })
})

describe('get url visits count', () => {
    it('returns total visits count for a specific short url', async () => {
        const userId = new mongoose.Types.ObjectId()
        const shortID = 'short123'
        await Visit.create({ short_id: shortID, user_id: userId, origin: 'IN', device: 'desktop' })

        req.user_id = userId
        req.params.shortID = shortID

        await getURLVisitsCount(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        const callArg = res.json.mock.calls[0][0]
        expect(callArg.success).toBe(true)
        expect(typeof callArg.payload).toBe('number')
        expect(callArg.payload).toBeGreaterThanOrEqual(1)
    })
})
