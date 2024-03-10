const chai = require('chai');
const chaiHttp = require('chai-http');

const baseUrl = 'https://us-central1-repsie.cloudfunctions.net/api'
const baseTestUrl = 'http://127.0.0.1:5001/repsie/us-central1/api'
const userTestUrl = 'user=UhdZz0L8dDSp2E05RVK9A5l4PQY2'
const postTestUrl = 'T1RsS3zhMmBnRHStb4vO'

chai.use(chaiHttp);
const expect = chai.expect

describe('Tests Get Saved Recipes', function () {
    this.timeout(100000);
    it('Tests if there are recipes that are saved by a user', async () => {
        try {
            const result = await chai.request(baseUrl).get(`/saved?${userTestUrl}`);
            expect(result.statusCode).to.equal(200);
            expect(result.body).to.be.an('Array');
            result.body.forEach((saved) => {
                expect(saved).haveOwnProperty('exists');
                expect(saved).to.equal(true)
            })
        }
        catch (err) {
           // done(err)
        }
    });
});

describe('Tests Add Saved Recipes', function () {
    this.timeout(100000);
    it('Attempts to save a recipe given a specified post id', async () => {
        try {
            // Good request
            const result = await chai.request(baseUrl)
            .post(`/saved?${userTestUrl}`)
            .set('content-type', 'application/json')
            .send({"id":postTestUrl})
            expect(result.body).haveOwnProperty('message')
            expect(result.body.message).to.be('Recipe saved successfully')

            // Bad request
            const res = await chai.request(baseUrl)
            .post(`/saved?${userTestUrl}`)
            .set('content-type', 'application/json')
            .send({})
            expect(res.body).haveOwnProperty('error')
            expect(res.body.message).to.be('Something went wrong while trying to save your recipe')
        }
        catch (err) {
            //done(err)
        }
    });
});

describe('Test unsaving a post', function () {
    this.timeout(100000)
    it('Allows a user to unsave a post given a specific post id', async () => {
        try {
            const result = await chai.request(baseUrl)
            .delete(`/saved?${userTestUrl}`)
            .set('content-type', 'application/json')
            .send({"id":postTestUrl})
            expect(result.statusCode).to.equal(201)
            expect(result.body).haveOwnProperty('message')
            expect(result.body.message).to.equal('Recipe unsaved successfully');

            const res = await chai.request(baseUrl)
            .delete(`/saved?${userTestUrl}`)
            .set('content-type', 'application/json')
            .send({})
            expect(res.statusCode).to.equal(404)
            expect(res.body).haveOwnProperty('error')
            expect(res.body.message).to.equal('Something went wrong while trying to unsave your recipe');
        }
        catch (err) {
           // done(err)
        }
    })
})