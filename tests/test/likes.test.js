const chai = require('chai');
const chaiHttp = require('chai-http');


const baseUrl = 'https://us-central1-repsie.cloudfunctions.net/api'
const baseTestUrl = 'http://127.0.0.1:5001/repsie/us-central1/api'

const postTestUrl = 'post=13GdPdi9e9FLoUReVZXH'

const userTestUrl = 'user=UhdZz0L8dDSp2E05RVK9A5l4PQY2'

chai.use(chaiHttp);
const expect = chai.expect

describe('Test Get All Likes', function () {
    this.timeout(100000);
    it('Tests by counting the number of documents in a post', async () => {
        try {
            const result = await chai.request(baseUrl).get(`/rating/post?${postTestUrl}`);
            expect(result.statusCode).to.equal(200);
            expect(result.body).to.be.an('Integer');
        }
        catch (err) {
           // done(err)
        }
    });
});

describe('Test Post A Like', function () {
    this.timeout(100000);
    it('Tests by adding a document that the post is liked', async () => {
        try {
            const result = await chai.request(baseUrl)
            .post(`/rating?${postTestUrl}&${userTestUrl}`)
            .set('content-type', 'application/json')
            expect(result.statusCode).to.equal(201);     
        }
        catch (err) {
           // done(err)
        }
    });
});


describe('Test Delete A Like', function () {
    this.timeout(100000);
    it('Tests by deleting a document that the post is liked', async () => {
        try {
            const result = await chai.request(baseUrl)
            .delete(`/rating?${postTestUrl}&${userTestUrl}`)
            .set('content-type', 'application/json')
            expect(result.statusCode).to.equal(200);  
        }
        catch (err) {
           // done(err)
        }
    });
});


describe('Test Get User Likes', function () {
    this.timeout(100000);
    it('Tests by getting all of the likes belonging to the user', async () => {
        try {
            const result = await chai.request(baseUrl)
            .get(`/rating/user?${userTestUrl}`)
            .set('content-type', 'application/json')
            expect(result.statusCode).to.equal(200);  
        }
        catch (err) {
           // done(err)
        }
    });
});