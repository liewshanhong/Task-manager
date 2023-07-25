const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { userOneId, userTwoId, userOne, userTwo, taskOne, taskTwo, taskThree, setupDatabase } = require('./fixtures/db')

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
    expect(task.completed).toBe(false)
})

test('Get user tasks', async () => {
    const res = await request(app)
            .get('/tasks')
            .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
            .send()
            .expect(200)
    expect(res.body.length).toBe(1)
})

test('Attempt to delete first user tasks by second user', async () => {
    const res = await request(app)
            .delete(`/tasks/${ taskOne._id }`)
            .set('Authorization', `Bearer ${ userTwo.tokens[0].token }`)
            .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()   
})