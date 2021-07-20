const app = require('../index');
const chai = require('chai');
const http = require('chai-http');
const UsersModel = require('../models/users_model');

chai.use(http);
chai.should();

describe('GET /users', () => {
  beforeEach(async () => {
    await UsersModel.delete_users();
  });
  it('Returns 404 for users not found', done => {
    chai.request(app)
    .get('/api/users')
    .end((err, res) => {
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('Users not found');

      done(err);
    });
  });
  it('Returns 200 for users found', async () => {
    await UsersModel.post_user({
      user_name: 'Sonic',
      user_email: 'sonic@outlook.com',
      user_password: 'sonicboom'
    });
    const res = await chai.request(app).get('/api/users');

    res.should.have.status(200);
    res.body.should.be.a('array');
  });
});

describe('GET /user', () => {
  beforeEach(async () => {
    await UsersModel.delete_users();
  });
  it('Returns 400 for invalid user id', done => {
    chai.request(app)
    .get('/api/user/o8s')
    .end((err, res) => {
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('Invalid user id');
      done(err);
    });
  });
  it('Returns 404 for user not found', done => {
    chai.request(app)
    .get('/api/user/12')
    .end((err, res) => {
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('User not found');
      done(err);
    });
  });
  it('Returns 200 for user found', async () => {
    const user = await UsersModel.post_user({
      user_name: 'name',
      user_email: 'user@email.com',
      user_password: 'pass'
    })
    const res = await chai.request(app).get(`/api/user/${user[0]}`);
    res.should.have.status(200);
    res.body.should.be.a('array');
  });
});

describe('POST /user', () => {
  beforeEach(async () => {
    await UsersModel.delete_users();
  });
  it('Returns 400 for user_name not sent', done => {
    chai.request(app)
    .post('/api/register')
    .send({})
    .end((err, res) => {
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('User name not sent');
      done(err);
    });
  });
  it('Returns 400 for user_email not sent', done => {
    chai.request(app)
    .post('/api/register')
    .send({
      user_name: 'algo'
    })
    .end((err, res) => {
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('User email not sent');
      done(err);
    });
  });
  it('Returns 400 for user_password not sent', done => {
    chai.request(app)
    .post('/api/register')
    .send({
      user_name: 'algo',
      user_email: 'algo@email.com'
    })
    .end((err, res) => {
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('User password not sent');
      done(err);
    });
  });
  it('Returns 403 for user already existent', async () => {
    await UsersModel.post_user({
      user_name: 'name',
      user_email: 'email@email.com',
      user_password: 'Password'
    });
    const res = await chai.request(app).post('/api/register')
    .send({
      user_name: 'Name',
      user_email: 'email@email.com',
      user_password: 'password'
    });
    res.should.have.status(403);
    res.body.should.be.a('object');
    res.body.should.have.property('message').eql('User already exists');
  })
  it('Returns 200 for user posted', done => {
    chai.request(app)
    .post('/api/register')
    .send({
      user_name: 'user name',
      user_email: 'email@outlook.com',
      user_password: 'passhere'
    })
    .end((err, res) => {
      res.should.have.status(201);
      res.body.should.be.a('array');
      done(err);
    })
  })
});
describe('POST /login', () => {
  beforeEach(async () => {
    await UsersModel.delete_users();
  });
  it('Returns 400 for user_email not sent', done => {
    chai.request(app)
    .post('/api/login')
    .send({})
    .end((err, res) => {
      res.should.have.status(400)
      res.body.should.be.a('object')
      res.body.should.have.property('message').eql('Email not sent');
      done(err)
    })
  })
  it('Returns 400 for user_email not sent', done => {
    chai.request(app)
    .post('/api/login')
    .send({
      user_email: 'email@email.com'
    })
    .end((err, res) => {
      res.should.have.status(400)
      res.body.should.be.a('object')
      res.body.should.have.property('message').eql('Password not sent');
      done(err);
    })
  })
  it('Returns 400 for user email not found', done => {
    chai.request(app)
    .post('/api/login')
    .send({
      user_email: 'email@email.com',
      user_password: 'mypassword'
    })
    .end((err, res) => {
      res.should.have.status(404)
      res.body.should.be.a('object')
      res.body.should.have.property('message').eql('User not found');
      done(err);
    })
  })
  it('Returns 403 for wrong password', async () => {
    await UsersModel.post_user({
      user_name: 'user name',
      user_email: 'email@outlook.com',
      user_password: 'password'
    });
    const res = await chai.request(app).post('/api/login')
    .send({
      user_email: 'email@outlook.com',
      user_password: '1234'
    });
    res.should.have.status(403);
    res.body.should.be.a('object');
    res.body.should.have.property('message').eql('Wrong password');
  })
  it('Returns 200 for token returned', async () => {
    await UsersModel.post_user({
      user_name: 'user name',
      user_email: 'email@gmail.com',
      user_password: 'password'
    });
    const res = await chai.request(app).post('/api/login')
    .send({
      user_email: 'email@gmail.com',
      user_password: 'password'
    });
    res.should.have.status(200);
    res.body.should.be.a('object');
    res.body.should.have.property('token');
  })
})
describe('POST /login', () => {
  beforeEach(async () => {
    await UsersModel.delete_users();
    await UsersModel.post_user({
      user_name: 'João Vitor',
      user_email: 'joaovitor3592@gmail.com',
      user_password: 'LegenDary123'
    });
  });
  it('Returns 400 for email not sent', done => {
    chai.request(app)
    .post('/api/login')
    .send({})
    .end((err, res) => {
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('Email not sent');
      done(err);
    });
  })
  it('Returns 400 for password not sent', done => {
    chai.request(app)
    .post('/api/login')
    .send({
      user_email: 'joaovitor3592@gmail.com'
    })
    .end((err, res) => {
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('Password not sent');
      done(err);
    });
  });
  it('Returns 404 for user not found', async () => {
    await UsersModel.delete_users();
    const res = await chai.request(app)
    .post('/api/login')
    .send({
      user_email: 'joaovitor3592@gmail.com',
      user_password: 'LegenDary123'
    });
    res.should.have.status(404);
    res.body.should.be.a('object');
    res.body.should.have.property('message').eql('User not found');
  });
  it('Returns 403 for wrong password', done => {
    chai.request(app)
    .post('/api/login')
    .send({
      user_email: 'joaovitor3592@gmail.com',
      user_password: '@Legen'
    })
    .end((err, res) => {
      res.should.have.status(403);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('Wrong password');
      done(err);
    });
  });
  it('Returns 200 for access token returned', done => {
    chai.request(app)
    .post('/api/login')
    .send({
      user_email: 'joaovitor3592@gmail.com',
      user_password: 'LegenDary123'
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('token');
      done(err);
    });
  });
})