const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userTwoId = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    name: 'John',
    email: 'John@example.com',
    password: 'John1234',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.SECRET)
    }]
}

const userTwo = {
    _id: userTwoId,
    name: 'Michelle',
    email: 'Michelle@example.com',
    password: 'Michelle1234',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'This is a good book',
    completed: false,
    author: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'This is a bad book',
    completed: true,
    author: userTwoId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'This is an ok book',
    completed: true,
    author: userTwoId
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userTwoId,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}
