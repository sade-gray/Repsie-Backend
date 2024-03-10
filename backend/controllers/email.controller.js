'use strict'
const sendEmail = require('../services/email.service.js')
const httpStatus = require('http-status')


const emailController = async (req, res) => {
    try {
      const { email, message } = req.body

      const Email = email.toString()
      const Message = message.toString()

      if (!Email || !Message) {
        return res.status(httpStatus.BAD_REQUEST).json({ error: 'Email and message are required.' });
      }

      const mail = await sendEmail(email, message)

      res.status(httpStatus.OK).json(mail)

    } catch (error) {
      throw new ErrorEvent.error
    }
  }


module.exports =  emailController