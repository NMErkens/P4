const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const authorizationHeader = 'Authorization';
let faketoken = 0;
let token;
const server = require('../main');

chai.should();
chai.use(chaiHttp);
/*
var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});*/

before(() => {
    console.log('-before: get valid token')
    const payload = {
        UserId : 13
    }
    jwt.sign({ data : payload}, 'secretkey', { expiresIn: 2 * 60}, (err, result)=>{
        if(result){
            token = result
        }
    })
})

describe('Appartments get',() => {
 it('should throw an error when JWT token is invalid', (done) =>{
      chai.request(server)
      .get('/api/Appartments')
      .set('Authorization', faketoken)
      .end((err,res)=>{
          res.should.have.status(401)
          done()
      })
  })
  it('should return all Appartments', done =>{
      chai.request(server)
      .get('/api/Appartments')
      .set('Authorization', token)
      .end((err,res)=>{
          res.should.have.status(200)
          done()
      })
  })

})


describe('POST Appartments',()=>{
  it('should throw an error when JWT token is invalid', (done) =>{
      chai.request(server)
      .get('/api/appartments')
      .set('Authorization', faketoken)
      .end((err,res)=>{
          res.should.have.status(401)
          done()
      })
  })

  it('should return 200', done => {
      chai.request(server)
      .post('/api/appartments')
      .set('Authorization', token)
      .send({
          Description : 'beschrijving',
          StreetAddress : 'straatnaam',
          PostalCode : '4823KK',
          City : 'breda'
      })
      .end((err, res) => {
          res.should.have.status(200);
          done()
      })
  })
})

describe('DELETE Appartement by id', ()=>{
  it('should throw an error when JWT token is invalid', (done) =>{
      chai.request(server)
      .get('/api/appartments/1')
      .set('Authorization', faketoken)
      .end((err,res)=>{
          res.should.have.status(401)
          done()
      })
  })

  it('should return the removed appartement when appartmentId exists',(done) =>{
      chai.request(server)
      .get('/api/appartments/15')
      .set('Authorization', token)
      .end((err,res)=>{
          res.should.have.status(200)
          done()
      })
  })

  it('should throw an error when appartmentId does not exist',(done)=>{
      chai.request(server)
      .get('/api/appartments/666')
      .set('Authorization', token)
      .end((err, res)=>{
          res.should.have.status(404)
          done()
      })
  })
})
describe('GET Appartements by ID', ()=>{
  it('should throw an error when JWT token is invalid', (done) =>{
      chai.request(server)
      .get('/api/appartments/1')
      .set('Authorization', faketoken)
      .end((err,res)=>{
          res.should.have.status(401)
          done()
      })
  })

  it('should return the correct appartment', (done) =>{
      chai.request(server)
      .get('/api/appartments/1')
      .set('Authorization', token)
      .end((err,res) => {
          res.should.have.status(200)
          done()
      })
  })

  it('should return an error if appartmentId does not exist', (done) => {
      chai.request(server)
      .get('/api/appartments/999')
      .set('Authorization', token)
      .end((err,res) => {
          res.should.have.status(404)
          done()
      })
  })
})

describe('PUT Appartments by ID', () => {
  it('should throw an error when JWT token is invalid', (done) =>{
      chai.request(server)
      .get('/api/appartments/1')
      .set('Authorization', faketoken)
      .end((err,res)=>{
          res.should.have.status(401)
          done()
      })
  })

  it('should return update an apartment with valid id and return res(200)', (done) =>{
      chai.request(server)
      .put('/api/appartments/2')
      .set('Authorization', token)
      .send({
          Description : 'beschrijving',
          StreetAddress : 'straatnaam',
          PostalCode : '4823KK',
          City : 'breda',
          UserId : '1'
      })
      .end((err,res)=>{
          res.should.have.status(200);
          res.body.should.be.a('object');

          const result = res.body.result;
          result.should.be.an('array').that.has.length(1);
          const appartment = result[0];
          appartment.should.have.property('ApartmentId')
          appartment.should.have.property('Description').equals('beschrijving')
          appartment.should.have.property('StreetAddress').equals('straatnaam')
          appartment.should.have.property('PostalCode').equals('4823KK')
          appartment.should.have.property('City').equals('breda')
          appartment.should.have.property('UserId').equals(1)
          done()
      })
  })
})

