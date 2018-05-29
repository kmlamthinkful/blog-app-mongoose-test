'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {BlogPost} = require('../models');
const {app, runServer, closeServer} = require ('../server')
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

//seed data
function seedBlogData(){
    console.info('seeding blog data');
    const seedData = [];

    for (let i = 1; i<=10; i++){
        seedData.push(generateBlogPost());
    }
    return BlogPost.insertMany(seedData);
}

function generateBlogPost(){
    return {
        author: {
            firstName: faker.name.firstName ,
            lastName:  faker.name.lastName
            },
        title: faker.name.title, 
        content: faker.lorem.paragraph,
        //created: Date.now
    }
}

//drop Database
function dropDatabase(){
    console.warn('Deleting Database');
    return mongoose.connection.dropDatabase();
}

describe('Blog API resource', function(){
    
    before(function(){
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function(){
        return seedBlogData();
    });

    afterEach(function(){
        return dropDatabase();
    });

    after(function(){
        return closeServer();
    });


    
describe('GET endpoint', function(){

    it('should return all blogposts', function(){
        let res;
        return chai.request(app)
            .get('/posts')
            .then(function(_res){
                res = _res;
                expect(res).to.have.status(200);
                expect(res.body.posts).to.have.lengthOf.at.least(1);
                return BlogPost.count();
            })
            .then(function(count){
                expect(res.body.posts).to.have.length.of(count)
            });
        });

    });

});
