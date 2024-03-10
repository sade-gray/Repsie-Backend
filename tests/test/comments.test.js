const chai = require('chai');
const chaiHttp = require('chai-http');
const {missingField} = require('../comments.data/post/badPostComment.js')
const {goodPostComment} = require('../comments.data/post/goodPostComment.js')


const baseUrl = 'https://us-central1-repsie.cloudfunctions.net/api'
const baseTestUrl = 'http://127.0.0.1:5001/repsie/us-central1/api'
const userTestUrl = 'user=DBeSxH2LuHPLzwVrnDbzgPm8Ai72'
let postTestUrl = 'post=13GdPdi9e9FLoUReVZXH'
let commentId = '5SL9JlgXUdKaRsvaphRp'

chai.use(chaiHttp);
const expect = chai.expect

describe('Tests Get Comments', function () {
    this.timeout(100000);
    it('Will retrive all of the comments under a specified post', async () => {
        try {
            const result = await chai.request(baseUrl).get(`/comments?${post}`);
            expect(result.statusCode).to.equal(200);
            expect(result.body).to.be.an('Array');
            if (result.body.length > 0 ) {
                result.body.forEach(async(comment) => {
                    expect(comment).haveOwnProperty('userId')
                    expect(comment).haveOwnProperty('commentBody')
                })
            }
        }
        catch (err) {
            //done(err)
        }
    });
});

describe('Tests Post Comments', function () {
    this.timeout(100000);
    it('Will post a comment under a specified post', async () => {
        try {
            missingField.forEach(async (testPostComment)=>  {
                const result = await chai.request(baseUrl)
                .post(`/comments?${postTestUrl}`)
                .set('content-type', 'application/json')
                .send(testPostComment);
                expect(result.body).haveOwnProperty('error')
                expect(result.statusCode).to.equal(400);
                expect(result.body.error).to.equal('Bad request');
            })
            const result = await chai.request(baseUrl)
            .post(`/comments?${postTestUrl}`)
            .set('content-type', 'application/json')
            .send(goodPostComment)
            expect(result.statusCode).to.equal(201)
            expect(result.body).haveOwnProperty('message')
            expect(result.body.error).to.equal('Your comment has been posted')
        }
        catch (err) {
            //done(err)
        }
    });
});


describe('Test deleting a comment', function () {
    this.timeout(100000)
    it('Deletes a user comment given a post id under a specific post', async () => {
        try {
            const result = await chai.request(baseUrl)
            .delete(`/comments?${postTestUrl}`)
            .set('content-type', 'application/json')
            .send({"commentId":commentId})
            expect(result.statusCode).to.equal(201)
            expect(result.body).haveOwnProperty('message')
            expect(result.body.message).to.equal('Comment deleted successfully');

            const res = await chai.request(baseUrl)
            .delete(`/comments?${postTestUrl}`)
            .set('content-type', 'application/json')
            .send({})
            expect(res.statusCode).to.equal(404)
            expect(res.body).haveOwnProperty('error')
            expect(res.body.message).to.equal('Bad request');
        }
        catch (err) {
           // done(err)
        }
    })
})