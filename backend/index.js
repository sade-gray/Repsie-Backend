'use strict'
const express = require('express')
const functions = require('firebase-functions')
//const fs = require('fs')
const cors = require('cors')
const bodyparser = require('body-parser')
const svgCaptcha = require('svg-captcha')
const hpp = require('hpp')
const { rateLimit } = require('express-rate-limit')
const morgan = require('morgan')

// const clusterFunction = require('./master.js')

const authMiddleware = require('./middleware/auth.js')

const routes = require('./routes/index.js')

const toobusy = require('toobusy-js')

const app = express()

app.use(morgan('combined'))

const captchaKeys = [1, 3, 23, 34, 433]

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 mins
	limit: 10000000000000000, 
	standardHeaders: 'draft-7', 
	legacyHeaders: false, 
    keyGenerator: (req, res) => req.ip
})

  // Too much traffic DoS - watches the event loop 
  // causes issues when making more than one request
  /*app.use((req, res, next) => {
    if (toobusy()) {
        res.status(503).send("Server Too Busy");
    } else {
    next();
    }
}) */

/*app.get('*', (req, res) => {
    res.redirect('https://' + req.headers.host + req.url)
    console.log(req.headers.host)
    console.log(req.url)
 })

 app.use((req, res, next)  => {
    var aYear = 60 * 60 * 24 * 365;
    // Set the Strict Transport Security header for a year
    // Also include subdomains
    res.set('Strict-Transport-Security',
    'max-age=' + aYear + ';includeSubdomains');
    next();
    }) */


app.disable('x-powered-by')
app.use(cors())
app.use(hpp())
app.use(express.json({ limit: "1kb" }));
app.use(bodyparser.json())
/*It should be noted that attackers can change the Content-Type header of the request and bypass request size limits. Therefore, before processing the request, data contained in the request should be validated against the content type stated in the request headers. If content type validation for each request affects the performance severely, you can only validate specific content types or request larger than a predetermined size. */
app.use(express.urlencoded({ extended: true, limit: "1kb" }))

app.use('/', limiter)
// app.use('/', clusterFunction)
//app.use('/', authMiddleware)
app.use('/', routes)

app.post('/captcha', (req, res) => {
    let captcha = svgCaptcha.create({size: 7, noise: 3, background: '#ffffff', color: true})
    res.type('svg')
    res.status(200).send(captcha.data)


    let index = -1

    let start = Date.now();

    if (req.key) {
    index = captchaKeys.indexOf(req.key)
        if (index !== -1 && (Date.now() - start) < 5000) {
            res.send(captcha.text)  
        }
    }
})



app.use("/*", (req, res) => {
    res.send({message: 'This resource does not exist'})
})

const PORT = 8000
//https.createServer(options, app).
app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`))

exports.api = functions.https.onRequest(app)