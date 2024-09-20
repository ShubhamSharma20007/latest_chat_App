const MessageModel = require('../models/messageModel')

const addMessage = async(req, res) => {

    try {
        const { from, to, message } = req.body;
        const msg = await MessageModel.create({
            message: { text: message },
            users: [from, to],
            sender: from
        })
        if (msg) return res.status(201).send({ status: true, message: 'Message sent' })
        return res.status(400).send({ status: false, message: 'Failed to send message' })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const getMessage = async(req, res) => {
    try {
        const { from, to } = req.body
        const messages = await MessageModel.find({
            users: { $all: [from, to] }
        }).sort({ updatedAt: 1 })
        const projectMessage = messages.map(function(msg) {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text
            }
        })
        return res.status(200).send({ status: true, data: projectMessage })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

module.exports = { addMessage, getMessage };