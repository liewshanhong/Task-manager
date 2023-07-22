require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findOneAndRemove('64b762dee9243236343a389b').then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: 'false'})
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const deleteTaskAndCount = async (id, completed) => {
    await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed })
    return count
}

deleteTaskAndCount('64b82b51a9314973f03f92fa', false).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})