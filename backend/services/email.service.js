const nodemailer = require('nodemailer')
const dotenv = require('dotenv/config')
const emailBody = require('../templates/raw/initial.email.contactUs.js')


const sendEmail = async (email, message) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    port: 519,
    auth: {
      user: process.env.CONTACT_EMAIL,
      pass: process.env.CONTACT_PASSWORD,
    },
    tls: {
      rejectUnauthorized: true,
    },
  })
  
  try {
    let Message = {
      from: process.env.CONTACT_EMAIL,
      to: process.env.CONTACT_EMAIL,
      subject: 'New Message',
      html: emailBody(email, message),
    }
    return await transporter.sendMail(Message, () => {
      console.log(emailBody(email, message))
    })
  } catch (error) {
    throw error
  }
}


module.exports =  sendEmail