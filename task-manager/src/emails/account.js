const mail = require('@sendgrid/mail')

mail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    mail.send({
        to: email,
        from: 'friscodiscolol@gmail.com',
        subject: 'Welcome to my task manager app!',
        text: `Welcome to the app, ${ name }!`
    })
}

const sendGoodbyeEmail = (email, name) => {
    mail.send({
        to: email,
        from: 'friscodiscolol@gmail.com',
        subject: 'Sorry to see you go',
        text: `Goodbye ${ name }, I hope to see you soon!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}