const chai = require('chai');
const chaiHttp = require('chai-http');
const badPostRecipe = require('../recipe.data/post/badPostRecipe.js')
const goodPostRecipe = require('../recipe.data/post/goodPostRecipe.js')
const putGoodRecipe = require('../recipe.data/put/goodPutRecipe.js')
const missingPutProperty = require('../recipe.data/put/badPutRecipe.js')

const baseUrl = 'https://us-central1-repsie.cloudfunctions.net/api'
const baseTestUrl = 'http://127.0.0.1:5001/repsie/us-central1/api'
const userTestUrl = 'user=DBeSxH2LuHPLzwVrnDbzgPm8Ai72'
let postTestUrl = 'post='

chai.use(chaiHttp);
const expect = chai.expect

describe('Tests Get Recipes', function () {
    this.timeout(100000);
    it('Tests if there are recipes', async () => {
        try {
            const result = await chai.request(baseUrl).get('/recipes');
            expect(result.statusCode).to.equal(200);
            expect(result.body).to.be.an('Array');
            result.body.forEach((recipe) => {
                expect(recipe).haveOwnProperty('id');
                expect(recipe).haveOwnProperty('title');
                expect(recipe).haveOwnProperty('timeRating');
                expect(recipe).haveOwnProperty('skillRating');
                expect(recipe).haveOwnProperty('userId');
                postId = recipe.id
            })
            postTestUrl += postId
        }
        catch (err) {
            done(err)
        }
    });
});

describe('Testing posting recipes', function () {
        this.timeout(100000);
        it('Tests if the db can post recipes successfully', async () => {
            try {
                badPostRecipe.missingPostProperty.forEach(async (testPostRecipe)=>  {
                    const result = await chai.request(baseUrl)
                    .post(`/recipes?${userTestUrl}`)
                    .set('content-type', 'application/json')
                    .send(testPostRecipe);
                    expect(result.body).haveOwnProperty('error')
                    expect(result.statusCode).to.equal(400);
                    expect(result.body.error).to.equal('Bad request');
                })
                badPostRecipe.badPostProperty.forEach(async (testPostRecipe)=>  {
                    const result = await chai.request(baseUrl)
                    .post(`/recipes?${userTestUrl}`)
                    .set('content-type', 'application/json')
                    .send(testPostRecipe);
                    expect(result.body).haveOwnProperty('error')
                    expect(result.statusCode).to.equal(400);
                    expect(result.body.error).to.equal('Bad request');
                })
                const result = await chai.request(baseUrl)
                .post(`/recipes?${userTestUrl}`)
                .set('content-type', 'application/json')
                .send(goodPostRecipe)
                expect(result.statusCode).to.equal(201)
                expect(result.body).haveOwnProperty('id')
            }
            catch (err) {
                done(err)
            }
    });
});

describe('Tests Updating a Recipe', function () {
    this.timeout(100000);
    it('Tests if it is possible to update a single user recipe', async () => {
        try {
            // Good request
            const result = await chai.request(baseUrl)
            .put(`/recipes?${postTestUrl}`)
            .set('content-type', 'application/json')
            .send(putGoodRecipe)
            expect(result.statusCode).to.equal(201)
            expect(result.body).haveOwnProperty('message')
            expect(result.body.message).to.equal('Your recipe has been updated successfully');

            // Bad request - missing field id 
            const res = await chai.request(baseUrl)
            .put(`/recipes?${postTestUrl}`)
            .set('content-type', 'application/json')
            .send(missingPutProperty)
            expect(res.statusCode).to.equal(201)
            expect(res.body).haveOwnProperty('error')
            expect(res.body.message).to.equal('Bad request');
        }
        catch (err) {
           // done(err)
        }
    });
});

describe('Test getting user recipes', function () {
    this.timeout(100000)
    it('Tests using a get request to get all recipes belonging to a specific user', async () => {
        try {
            const result = await chai.request(baseUrl)
            .get(`/recipes?${userTestUrl}`)
            expect(result.body).to.be.an('Array');
            if (result.body.length > 0) {
                result.body.forEach((recipe) => {
                    expect(recipe).haveOwnProperty('id');
                    expect(recipe).haveOwnProperty('title');
                    expect(recipe).haveOwnProperty('timeRating');
                    expect(recipe).haveOwnProperty('skillRating');
                    expect(recipe).haveOwnProperty('userId');
                })
            }
        }
        catch (err) {
           // done(err)
        }
    })
})

describe('Test deleting a recipe', function () {
    this.timeout(100000)
    it('Deletes a user recipe given a post id', async () => {
        try {
            const result = await chai.request(baseUrl)
            .delete(`/recipes?${postTestUrl}`)
            .set('content-type', 'application/json')
            .send(putGoodRecipe)
            expect(result.statusCode).to.equal(201)
            expect(result.body).haveOwnProperty('message')
            expect(result.body.message).to.equal('Your recipe has been deleted successfully');
        }
        catch (err) {
           // done(err)
        }
    })
})

describe('Test getting a single recipe', function () {
    this.timeout(100000)
    it('Tests to get a single recipe with a specified post id', async () => {
        try {
            const result = await chai.request(baseUrl)
            .get(`/recipes?${postTestUrl}`)
            expect(result.body).haveOwnProperty('id');
            expect(result.body).haveOwnProperty('title');
            expect(result.body).haveOwnProperty('timeRating');
            expect(result.body).haveOwnProperty('skillRating');
            expect(result.body).haveOwnProperty('userId');
        }
        catch (err) {
           // done(err)
        }
    })
})