const chai = require('chai');
const app = require('../index');
const http = require('chai-http');
const ThumbsModel = require('../models/thumbs_model');
const VideosModel = require('../models/videos_model');

chai.should();
chai.use(http);

describe('GET /thumbs', () => {
  beforeEach(async () => {
    await VideosModel.delete_videos();
  });
  it('Returns 404 for thumbs not found', done => {
    chai.request(app)
    .get('/api/thumbs')
    .end((err, res) => {
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('No thumbs found');
      done(err);
    });
  });
  it('Returns 200 for thumbs found', async () => {
    const video = await VideosModel.insert_video({
      title: 'Video 1',
      description: 'Description 1',
      duration: '5'
    });
    await ThumbsModel.post_thumb({
      video_id: video[0],
      thumb_title: 'thumb title',
      thumb_size: '2500',
      thumb_url: 'http://url.com.br'
    });
    const res = await chai.request(app)
    .get('/api/thumbs');
    
    res.should.have.status(200);
    res.body.should.be.a('array');
  });
});
describe('POST /thumb', () => {
  beforeEach(async () => {
    await VideosModel.delete_videos();
  })
  it('Returns 400 for video_id not passed', done => {
    chai.request(app)
    .post('/api/thumb')
    .send({
      image_name: 'dfdf'
    })
    .end((err, res) => {
      res.should.have.status(400)
      res.body.should.be.a('object')
      res.body.should.have.property('message').eql('Video id is needed')
      done(err)
    });
  });
  it('Returns 404 for video_id sent not found', done => {
    chai.request(app)
    .post('/api/thumb')
    .send({
      video_id: 2234
    })
    .end((err, res) => {
      res.should.have.status(404)
      res.body.should.be.a('object')
      res.body.should.have.property('message').eql('Thumbs video not found')
      done(err)
    });
  });
  it('Returns 403 for thumb with duplicate video_id', async () => {
    const video = await VideosModel.insert_video({
      title: 'Video 1',
      description: 'Description 1',
      duration: '5'
    });
    await ThumbsModel.post_thumb({
      video_id: video[0],
      thumb_title: 'thumb title',
      thumb_size: '2500',
      thumb_url: 'http://url.com.br'
    });
    const res = await chai.request(app)
    .post('/api/thumb')
    .send({
      video_id: video[0]   
    })
    res.should.have.status(403)
    res.body.should.be.a('object')
    res.body.should.have.property('message').eql('Video thumb already exists')
  });
  it('Returns 200 for nothing to upload', async () => {
    const video = await VideosModel.insert_video({
      title: 'Video 1',
      description: 'Description 1',
      duration: '5'
    });
    const res = await chai.request(app)
    .post('/api/thumb')
    .send({
      video_id: video[0]
    })
    res.should.have.status(200)
    res.body.should.be.a('object')
    res.body.should.have.property('message').eql('Nothing to upload')
  });
  it('Returns 400 for file key not passed', async () => {
    const video = await VideosModel.insert_video({
      title: 'Video 1',
      description: 'Description 1',
      duration: '5'
    });
    const res = await chai.request(app)
    .post('/api/thumb')
    .send({
      video_id: video[0],
      size: 123
    })
    res.should.have.status(400)
    res.body.should.be.a('object')
    res.body.should.have.property('message').eql('No file key passed')
  });
  it('Returns 400 for file location not passed', async () => {
    const video = await VideosModel.insert_video({
      title: 'Video 1',
      description: 'Description 1',
      duration: '5'
    });
    const res = await chai.request(app)
    .post('/api/thumb')
    .send({
      video_id: video[0],
      key: 'key',
    })
    res.should.have.status(400)
    res.body.should.be.a('object')
    res.body.should.have.property('message').eql('No file ulr passed')
  });
  it('Returns 400 for file size not passed', async () => {
    const video = await VideosModel.insert_video({
      title: 'Video 1',
      description: 'Description 1',
      duration: '5'
    });
    const res = await chai.request(app)
    .post('/api/thumb')
    .send({
      video_id: video[0],
      key: 'file key',
      location: 'loc'
    })
    res.should.have.status(400)
    res.body.should.be.a('object')
    res.body.should.have.property('message').eql('No file size passed')
  });
});
describe('DELETE /thumb', () => {
  beforeEach(async () => {
    await VideosModel.delete_videos();
  })
  it('Returns 400 for invalid video_id', done => {
    chai.request(app)
    .delete(`/api/thumb/sdd`)
    .end((err, res) => {
      res.should.have.status(400)
      res.body.should.be.a('object')
      res.body.should.have.property('message').eql("Invalid video id");
      done(err);
    });
  });
  it('Returns 404 for video_id not found', done => {
    chai.request(app)
    .delete('/api/thumb/2200')
    .end((err, res) => {
      res.should.have.status(404)
      res.body.should.be.a('object')
      res.body.should.have.property('message').eql('Could not find the video which thumb belongs to');
      done(err);
    });
  });
  it('Returns 200 for video thumb deleted', async () => {
    const video = await VideosModel.insert_video({
      title: 'Video titles',
      description: 'Video description',
      duration: '10:00'
    });
    await ThumbsModel.post_thumb({
      video_id: video[0],
      thumb_title: 'thumb title',
      thumb_size: 123,
      thumb_url: 'http://www.url.com'
    });
    const res = await chai.request(app)
    .delete(`/api/thumb/${video[0]}`)

    res.should.have.status(200)
    res.body.should.be.a('object')
    res.body.should.have.property('message').eql('Thumb deleted');
  });
});