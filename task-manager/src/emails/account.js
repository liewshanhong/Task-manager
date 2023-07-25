const mail = require('@sendgrid/mail')
const key = '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'

mail.setApiKey(key)

mail.send({
    to: 'friscodiscolol@gmail.com',
    from: 'friscodiscolol@gmail.com',
    subject: 'Welcome to my task-manager app',
    text: 'I hope you have fun using this app!'
})