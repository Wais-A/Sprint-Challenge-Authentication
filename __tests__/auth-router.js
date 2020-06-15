// @ts-nocheck
const server = require('../api/server');
const request = require('supertest')
const db = require('../database/dbConfig')

describe('server.js', ()=>{
 test('should test the environment', ()=>{
  const testing = process.env.DB_ENV
  expect(testing).toBe('testing')
 })
})

describe('GET /api/jokes', ()=> {
 it('should return 401', async () => {
  const res = await request(server).get('/api/jokes')
  expect( res.body.message ).toBe('You are not authorized')
 })

 it('should be json', async () =>{
  const res = await request(server).get('/api/jokes')
  expect(res.type).toBe('application/json')
 })


})

describe('registering information', ()=>{
 const newuser = {username: 'new_user-working', password: '123456'}

 beforeEach(async ()=>{
  await db('users').truncate()
 })

describe('Post /api/auth/register', () =>{
 it('should test post for register', async () =>{
    return await request(server).post('/api/auth/register').send(newuser).then(res => {
   expect(res.body.data.username).toBe(newuser.username)
  })
  
 })
 it('should make sure password is a string', async ()=>{
  return await request( server ).post( '/api/auth/register' ).send( newuser ).then( res =>
  {
   expect( typeof res.body.data.password ).toEqual( 'string' );
  } )
 })

 it('should return a status of 201', async () =>{
  return await request(server).post('/api/auth/register').send(newuser).then(res => {
   expect(res.status).toBe(201)
  })
 })

 describe('login test', () =>{
  it('should give back welcome message', async () =>{
    await request(server).post('/api/auth/register').send(newuser)
    return await request(server).post('/api/auth/login').send(newuser).then(res => {
     expect(res.body.message).toBe('welcome')
    })
  })
  it('should return an ok result', async ()=>{
   await request( server ).post( '/api/auth/register' ).send(newuser)
    await request( server ).post( '/api/auth/login' ).send(newuser).then(res => {
    expect(res.status).toBe(200)
    })
   })
  })
 })
})