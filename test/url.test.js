jest.setTimeout(20000)

const Config = require("../server/config/testConfig")
const { setupMongoDBConnection, closeMongoConnection } = require("../server/mongodb/mongodb")
setupMongoDBConnection(Config.database)
const mongoose = require('mongoose')

const { createShortURL, originalURL, getAllURLs, getURLsCount, deleteURL } = require('../app/url')
const URL = require('../model/url')
const Visit = require('../model/visit')

let req, res

afterEach(async () => {
    await URL.deleteMany({})
    await Visit.deleteMany({})
})

afterAll(async () => {
    await closeMongoConnection()
})

beforeEach(() => {
    req = { body: {}, params: {}, query: {}, headers: {}, connection: {}, device: { type: 'desktop' } }
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        redirect: jest.fn()
    }
})

describe('create short url', () => {
    it('returns error if url is missing', async () => {
        await createShortURL(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        const callArg = res.json.mock.calls[0][0]
        expect(callArg.success).toBe(false)
    })

    it('returns error if url is invalid', async () => {
        req.body.url = "invalid_url"
        await createShortURL(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        const callArg = res.json.mock.calls[0][0]
        expect(callArg.success).toBe(false)
    })

    it('creates a short url in DB and returns short_id', async () => {
        req.body.url = "https://example.com"
        const userId = new mongoose.Types.ObjectId()
        req.user_id = userId
        req.plan = "FREE"

        await createShortURL(req, res)

        const urlInDb = await URL.findOne({ user_id: userId })
        expect(urlInDb).not.toBeNull()
        expect(res.status).toHaveBeenCalledWith(201)
        const callArg = res.json.mock.calls[0][0]
        expect(callArg.success).toBe(true)
    })
})

describe('original url', () => {
    it('returns error if short id is missing', async () => {
        await originalURL(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        const callArg = res.json.mock.calls[0][0]
        expect(callArg.success).toBe(false)
    })

    it('returns error if short url does not exist', async () => {
        req.params.shortID = "abc123"
        await originalURL(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        const callArg = res.json.mock.calls[0][0]
        expect(callArg.success).toBe(false)
    })

    it('redirects to original url if short url exists', async () => {
        req.body.url = "https://example.com"
        const userId = new mongoose.Types.ObjectId()
        req.user_id = userId
        req.plan = "FREE"
        await createShortURL(req, res)

        const urlInDb = await URL.findOne({ user_id: userId })

        res.status.mockClear()
        res.json.mockClear()

        req.params.shortID = urlInDb.short_id
        await originalURL(req, res)

        expect(res.redirect).toHaveBeenCalledWith("https://example.com")
    })
})

describe('get all urls', () => {
    it('returns list of urls of a user', async () => {
        req.body.url = "https://example.com"
        const userId = new mongoose.Types.ObjectId()
        req.user_id = userId
        req.plan = "FREE"
        await createShortURL(req, res)

        res.status.mockClear()
        res.json.mockClear()

        req.query.page = 0
        await getAllURLs(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        const callArg = res.json.mock.calls[0][0]
        expect(callArg.success).toBe(true)
        expect(Array.isArray(callArg.payload)).toBe(true)
    })
})

describe('get urls count', () => {
    it('returns count of urls created by user', async () => {
        req.body.url = "https://example.com"
        const userId = new mongoose.Types.ObjectId()
        req.user_id = userId
        req.plan = "FREE"
        await createShortURL(req, res)

        res.status.mockClear()
        res.json.mockClear()

        req.user_id = userId
        await getURLsCount(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        const callArg = res.json.mock.calls[0][0]
        expect(callArg.success).toBe(true)
        expect(typeof callArg.payload).toBe("number")
    })
})

describe('delete url', () => {
    it('deletes a short url successfully', async () => {
        req.body.url = "https://example.com"
        const userId = new mongoose.Types.ObjectId()
        req.user_id = userId
        req.plan = "FREE"
        await createShortURL(req, res)

        const urlInDb = await URL.findOne({ user_id: userId })

        res.status.mockClear()
        res.json.mockClear()

        req.user_id = userId
        req.params.shortID = urlInDb.short_id

        await deleteURL(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        const callArg = res.json.mock.calls[0][0]
        expect(callArg.success).toBe(true)
    })

    it('returns error if url does not exist', async () => {
        const userId = new mongoose.Types.ObjectId();
        req.user_id = userId
        req.params.shortID = "invalid_id"

        await deleteURL(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        const callArg = res.json.mock.calls[0][0]
        expect(callArg.success).toBe(false)
    })
})
