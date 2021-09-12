const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')
const bcrypt = require('bcryptjs')
 
beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db("users").truncate()
})
afterAll(async () => {
  await db.destroy()
})

// Write your tests here
test('[0]sanity', () => {
  expect(true).toBe(true)
})


describe("server.js", ()=>{
  describe("[POST] /api/auth/register",() =>{
    it('[1] responds with correct status on success', async ()=>{
        const res = await request(server).post('/api/auth/register').send({ username: 'newUser', password: '1234' })
        expect(res.status).toBe(201)
    }, 750)
    it('[2] saves the user with a bcrypted password instead of plain text', async ()=>{
        await request(server).post('/api/auth/register').send({ username: 'newUser', password: '1234' })
        const newUser = await db('users').where('username', 'newUser').first()
        expect(bcrypt.compareSync('1234', newUser.password)).toBeTruthy()
    },750)

  })
  describe("[POST] /api/auth/login" ,() =>{
    it('[3] responds with correct status on success', async ()=>{
        await request(server).post('/api/auth/register').send({ username: 'newUser', password: '1234' })
        const res = await request(server).post('/api/auth/login').send({ username: 'newUser', password: '1234' })
        expect(res.status).toBe(200)
    }, 750)
    it('[4] responds with the correct message on invalid credentials', async ()=>{
        let res = await request(server).post('/api/auth/login').send({ username: 'newUser', password: '12345' })
        expect(res.body.message).toMatch(/invalid credentials/i)
        expect(res.status).toBe(401)

        res = await request(server).post('/api/auth/login').send({ username: 'oldUser', password: '1234' })
        expect(res.body.message).toMatch(/invalid credentials/i)
        expect(res.status).toBe(401)

    }, 750)
  })
  describe("[GET] /api/jokes",() =>{
    it('[5] requests without a token return with proper message', async () => {
        const res = await request(server).get('/api/jokes')
        expect(res.body.message).toMatch(/token required/i)
    }, 750)
    it('[6] requests with a valid token return correct status (200)', async () => {
        await request(server).post('/api/auth/register').send({ username: 'newUser', password: '1234' })
        let res = await request(server).post('/api/auth/login').send({ username: 'newUser', password: '1234' })
        res = await request(server).get('/api/jokes').set('Authorization', res.body.token)
        expect(res.status).toBe(200)
    }, 750)
  })
})