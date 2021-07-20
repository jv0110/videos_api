const app = require('../index');
const chai = require('chai');
const http = require('chai-http');
const VideosModel = require('../models/videos_model');
const ThumbsModel = require('../models/thumbs_model');

chai.should();
chai.use(http);

describe('GET /', () => {
  it('Returns 200 if root route is succesfully accessed', done => {
    chai.request(app).get('/api') 
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('name').eql('Videos API')
      res.body.should.have.property('version').eql(1.0);
      res.body.should.have.property('message').eql('Welcome to the Videos API');

      done(err);
    });
  });
});
describe('GET /videos', () => {
  beforeEach(async () => {
    await VideosModel.delete_videos();
  });
  it('Returns 404 for videos not found', done => {
    chai.request(app).get('/api/videos')
    .end((err, res) => {
       res.should.have.status(404);
       res.body.should.be.a('object');
       res.body.should.have.property('message').eql('No videos found');
       done(err);
    });
  });
  it('Returns 200 for videos found', async () => {
    const video = await VideosModel.insert_video({
      title: 'title',
      description: 'Descrição',
      duration: '10:00',
      likes: 100,
      deslikes: 30
    });
    await ThumbsModel.post_thumb({
      thumb_title: 'thumb',
      thumb_size: 200,
      thumb_url: 'dinfoidfno',
      video_id: video[0]
    });
    const res = await chai.request(app).get('/api/videos');
    res.should.have.status(200);
    res.body.should.be.a('array');
  });
});
describe('POST /videos', () => {
  beforeEach(async () => {
    await VideosModel.delete_videos();
  });
  it('Returns 400 for title not passed', done => {
    chai.request(app)
    .post('/api/video')
    .send({
      description: 'Descrição',
      duration: '10:00'
    })
    .end((err, res) => {
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('title is missing');
      done(err);
    });
  });
  it('Returns 400 for description not passed', done => {
    chai.request(app)
    .post('/api/video')
    .send({
      title: 'title',
      duration: '10:00'
    })
    .end((err, res) => {
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('Description is missing');
      done(err);
    });
  });
  it('Returns 400 for duration not passed', done => {
    chai.request(app)
    .post('/api/video')
    .send({
      title: 'title',
      description: 'Description'
    })
    .end((err, res) => {
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('Duration is missing');
      done(err);
    });
  });
  it('Returns 400 for duration not having a valid format', done => {
    chai.request(app)
    .post('/api/video')
    .send({
      title: 'Title 1',
      description: 'Description for video 1',
      duration: 'erd'
    })
    .end((err, res) => {
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('Duration does not have a valid format');
      done(err);
    });
  });
  it('Returns 200 for video posted', done => {
    chai.request(app)
    .post('/api/video')
    .send({
      title: 'Video 1',
      description: 'Description for video 1',
      duration: '500'
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      done(err);
    });
  });
});
describe('PUT /video', () => {
  beforeEach(async() => {
    await VideosModel.delete_videos();
  });
  it('Returns 403 if video id is not passed', done => {
    chai.request(app)
    .put('/api/video')
    .send({
      title: 'Titulo 2'
    })
    .end((err, res) => {
      res.should.have.status(403);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('Video no found');
      done(err);
    });
  });
  it('Returns 404 if videos is not found', done => {
    chai.request(app)
    .put('/api/video')
    .send({
      video_id: 2000,
      title: 'Title'
    })
    .end((err, res) => {
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('Video not found');
      done(err);
    })
  })
  it('Returns 200 if no edits are made', done => {
    chai.request(app)
    .put('/api/video')
    .send({})
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('Video updated');
      done(err);
    });
  });
  it('Returns 200 if update was successfull', async () => {
    const video_id = await VideosModel.insert_video({
      title: 'title1',
      description: 'desc',
      duration: '10'
    });
    const res = await chai.request(app)
    .put('/api/video')
    .send({
      video_id: video_id[0],
      title: 'Mano updatou caraio'
    });
    res.should.have.status(200);
    res.body.should.be.a('object');
    res.body.should.have.property('message').eql('Video updated');

  });
});
describe('DELETE /video', () => {
  beforeEach(async () => {
    await VideosModel.delete_videos()
  });
  it('Returns 400 for video_id invalid', done => {
    chai.request(app)
    .delete('/api/video/dd')
    .end((err, res) => {
      res.should.have.status(400)
      res.body.should.be.a('object')
      res.body.should.have.property('message').eql('Invalid video id')
      done(err)
    });
  });
  it('Returns 404 for video not found', done => {
    chai.request(app)
    .delete('/api/video/12')
    .end((err, res) => {
      res.should.have.status(404)
      res.body.should.be.a('object')
      res.body.should.have.property('message').eql('Video not found')
      done(err);
    });
  });
  it('Returns 200 for video deleted', async () => {
    const video = await VideosModel.insert_video({
      title: 'Video title',
      description: 'Video description',
      duration: '10:00'
    });
    const res = await chai.request(app).delete(`/api/video/${video[0]}`)

    res.should.have.status(200)
    res.body.should.be.a('object')
    res.body.should.have.property('message').eql('Video deleted')
  })
})