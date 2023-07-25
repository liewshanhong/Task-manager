const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'John',
    email: 'John@example.com',
    password: 'John1234',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.SECRET)
    }]
}

beforeEach( async () => {
   await User.deleteMany()
   await new User(userOne).save()
})

test('Sign up a user', async () => {
    await request(app)
        .post('/users')
        .send({
                name: 'Tom',
                email: 'Tom@gmail.com',
                password: 'Tom1234'
            })
        .expect(201)
})

test('Login existing user', async () => {
    const res = await request(app)
            .post('/users/login')
            .send({
                email: userOne.email,
                password: userOne.password
            })
            .expect(200)
    const user = await User.findById(userOneId)
    expect(res.body.token).toBe(user.tokens[1].token)

})

test('Login non-existent user', async () => {
    await request(app)
        .post('/users/login')
        .send({
                email: 'haha@example.com',
                password: 'haha1234'
             })
        .expect(400)
})

test('Get profile user', async () => {
    await request(app)
        .get('/users/profile')
        .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
        .send()
        .expect(200)
})

test('Get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/profile')
        .send()
        .expect(401)
})

test('Delete a user account', async () => {
    await request(app)
        .delete('/users/profile')
        .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
        .send()
        .expect(200)
    expect(await User.findById(userOneId)).toBeNull()
})

test('Delete an unauthenticated user account', async () => {
    await request(app)
        .delete('/users/profile')
        .send()
        .expect(401)
})

test('Upload user profile picture', async () => {
    await request(app)
    .post('/users/profile/upload-avatar')
    .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
    .attach('avatar', 'tests/fixtures/profile.JPG')
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Update valid user field', async () => {
    await request(app)
        .patch('/users/update')
        .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
        .send({
            name: 'Mike'
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('Mike')
})

test('Update invalid user field', async () => {
    await request(app)
        .patch('/users/update')
        .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
        .send({
            house: 'Mike'
        })
        .expect(400)
})