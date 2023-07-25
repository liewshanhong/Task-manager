const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Create a task for user', async () => {
    const res = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
            .send({
                description: 'This is a good book review'
            })
            .expect(201)
    const task = await Task.findById(res.body._id)
    expect(task).not.toBeNull()
})