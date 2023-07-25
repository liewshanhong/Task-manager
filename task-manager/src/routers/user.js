const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/authentication')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendGoodbyeEmail } = require('../emails/account')

const upload = multer({
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(JPG|JPEG|PNG)/)){
            cb(new Error('File type not supported'))
        }
        cb(undefined, true)
    }
})

// POST requests
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateToken()
        res.status(201).send({ user, token })
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.send({ user, token })
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.post('/users/logout-all', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    }catch(e){
        res.status(500).send()
    }
})

router.post('/users/profile/upload-avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({  height: 250, width: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send(error.message)
})

// GET requests
router.get('/users/profile', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error('Unable to find user or avatar.')
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

// PATCH requests
router.patch('/users/update', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password','age']
    const isValid = updates.every((update) => allowedUpdates.includes(update))
    if(!isValid){
        return res.status(400).send({ error: 'Invalid updates.'})
    }
    try{
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

// DELETE request
router.delete('/users/profile', auth, async (req, res) => {
    try{
        await req.user.remove()
        sendGoodbyeEmail(req.user.email, req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

router.delete('/users/profile/delete-avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send(req.user)
})

module.exports = router