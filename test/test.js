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
        UserId : 730
    }
    jwt.sign({ data : payload}, 'MySecretPenguinKey123', { expiresIn: 2 * 60}, (err, result)=>{
        if(result){
            token = "bearer " + result
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
/*
describe('DELETE Appartement by id', ()=>{
  it('should throw an error when JWT token is invalid', (done) =>{
      chai.request(server)
      .delete('/api/appartments/1')
      .set('Authorization', faketoken)
      .end((err,res)=>{
          res.should.have.status(401)
          done()
      })
  })

  it('should return the removed appartement when appartmentId exists',(done) =>{
      chai.request(server)
      .delete('/api/Appartments/2397')
      .set('Authorization', token)
      .end((err,res)=>{
          res.should.have.status(200)
          done()
      })
  })

  it('should throw an error when appartmentId does not exist',(done)=>{
      chai.request(server)
      .delete('/api/appartments/666')
      .set('Authorization', token)
      .end((err, res)=>{
          res.should.have.status(404)
          done()
      })
  })
  it('should throw 404 no acces',(done)=>{
    chai.request(server)
    .delete('/api/appartments/1233')
    .set('Authorization', token)
    .end((err, res)=>{
        res.should.have.status(404)
        done()
    })
})
})*/
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
      .get('/api/appartments/2281')
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
      .put('/api/appartments/2281')
      .set('Authorization', token)
      .send({
          Description : 'beschrijving',
          StreetAddress : 'straatnaam',
          PostalCode : '4823KK',
          City : 'breda'
          //UserId : '730'
      })
      .end((err,res)=>{
          res.should.have.status(200);
          done()
      })
  })
})

describe('Reservations get',() => {
    it('should throw an error when JWT token is invalid', (done) =>{
         chai.request(server)
         .get('/api/reservations')
         .set('Authorization', faketoken)
         .end((err,res)=>{
             res.should.have.status(401)
             done()
         })
     })
     it('should return all Reservations', done =>{
         chai.request(server)
         .get('/api/reservations')
         .set('Authorization', token)
         .end((err,res)=>{
             res.should.have.status(200)
             done()
         })
    })
   
})

describe('GET Reservations by ID', ()=>{
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
        .get('/api/appartments/1231/reservations')
        .set('Authorization', token)
        .end((err,res) => {
            res.should.have.status(200)
            done()
        })
    })
  
    it('should return an error if reservation does not exist', (done) => {
        chai.request(server)
        .get('/api/appartments/999/reservations')
        .set('Authorization', token)
        .end((err,res) => {
            res.should.have.status(404)
            done()
        })
    })
  })

describe('POST Reservations',()=>{
  it('should throw an error when JWT token is invalid', (done) =>{
      chai.request(server)
      .get('/api/appartments/2281/reservations')
      .set('Authorization', faketoken)
      .end((err,res)=>{
          res.should.have.status(401)
          done()
      })
  })

  it('should return 200', done => {
      chai.request(server)
      .post('/api/appartments/2281/reservations')
      .set('Authorization', token)
      .send({
        "StartDate": "2019-10-10T00:00:00.000Z",
        "EndDate": "2021-10-10T00:00:00.000Z",
        "Status": "INITIAL"
      })
      .end((err, res) => {
          res.should.have.status(200);
          done()
      })
  })
})

describe('PUT Reservation by ID', () => {
    it('should throw an error when JWT token is invalid', (done) =>{
        chai.request(server)
        .put('/api/appartments/2281/reservations/1922')
        .set('Authorization', faketoken)
        .end((err,res)=>{
            res.should.have.status(401)
            done()
        })
    })
  
    it('should return update an reservation with valid id and return res(200)', (done) =>{
        chai.request(server)
        .put('/api/appartments/2281/reservations/1922')
        .set('Authorization', token)
        .send({
            "StartDate": "2019-10-10T00:00:00.000Z",
            "EndDate": "2021-10-10T00:00:00.000Z",
            "Status": "INITIAL"
        })
        .end((err,res)=>{
            res.should.have.status(200);
            done()
        })
    })
    it('should return no acces and return res(401)', (done) =>{
        chai.request(server)
        .put('/api/appartments/1231/reservations/1900')
        .set('Authorization', token)
        .send({
            "StartDate": "2019-10-10T00:00:00.000Z",
            "EndDate": "2021-10-10T00:00:00.000Z",
            "Status": "INITIAL"
        })
        .end((err,res)=>{
            res.should.have.status(401);
            done()
        })
    })
})
/* even uitgezet anders verwijdert het met elke test en dan falen andere testen
describe('DELETE reservation by id', ()=>{
    it('should throw an error when JWT token is invalid', (done) =>{
        chai.request(server)
        .delete('/api/appartments/2281/reservations/1908')
        .set('Authorization', faketoken)
        .end((err,res)=>{
            res.should.have.status(401)
            done()
        })
    })
  
    it('should return the removed result 200 succesfully removed when appartmentId exists',(done) =>{
        chai.request(server)
        .delete('/api/appartments/2281/reservations/1922')
        .set('Authorization', token)
        .end((err,res)=>{
            res.should.have.status(200)
            done()
        })
    })
  
    it('should throw an error when reservation does not exist',(done)=>{
        chai.request(server)
        .delete('/api/appartments/2281/reservations/4500')
        .set('Authorization', token)
        .end((err, res)=>{
            res.should.have.status(404)
            done()
        })
    })
    it('should throw 404 no acces',(done)=>{
        chai.request(server)
        .delete('/api/appartments/1231/reservations/873')
        .set('Authorization', token)
        .end((err, res)=>{
            res.should.have.status(404)
            done()
        })
    })
  })
*/