const VideosModel = require('../models/videos_model');

class VideosController{
  async get_videos(req, res){
    const videos = await VideosModel.select_videos_with_thumbs();
    if(!videos.length){
      return res.status(404).json({
        message: 'No videos found'
      });
    }
    return res.status(200).send(videos);
  }

  async post_video(req, res){
    const data = {
      ...req.body
    }
    if(!data.title){
      return res.status(400).json({
        message: 'title is missing'
      });
    }else if(!data.description){
      return res.status(400).json({
        message: 'Description is missing'
      });
    }else if(!data.duration){
      return res.status(400).json({
        message: 'Duration is missing'
      });
    }else{
      const duration_num = parseFloat(data.duration);
      if(isNaN(duration_num) || duration_num < 0){
        return res.status(400).json({
          message: 'Duration does not have a valid format'
        });
      }else{
        data.duration = duration_num;
      } 
    }
    const insert_video = await VideosModel.insert_video(data);
    if(!insert_video){
      return res.status(500).json({
        message: 'Could not post video. An internal error has ocurred'
      });
    }
    return res.status(200).send(insert_video)
  }

  async update_video(req, res){
    const data = {
      ...req.body
    }
    if(!Object.keys(data).length){
      return res.status(200).json({
        message: 'Video updated'
      });
    }else{
      if(!data.video_id){
        return res.status(403).json({
          message: 'Video no found'
        });
      }
    }
    const video_id = await VideosModel.select_video(data.video_id);
    if(!video_id.length){
      return res.status(404).json({
        message: 'Video not found'
      });
    }
    if(!await VideosModel.update_video(data, data.video_id)){
      return res.status(500).json({
        message: 'Error updating. An error has ocurred'
      });
    }
    return res.status(200).json({
      message: 'Video updated'
    });
  }

  async delete_video(req, res){
    const { video_id } = req.params;
    if(isNaN(video_id)){
      return res.status(400).json({
        message: 'Invalid video id'
      });
    }else{
      const find_video = await VideosModel.select_video(video_id);
      if(!find_video.length){
        return res.status(404).json({
          message: 'Video not found'
        });
      }
    }
    const del_video = await VideosModel.delete_video(video_id);
    if(!del_video){
      return res.status(500).json({
        message: 'Error deleting the video'
      });
    }
    return res.status(200).json({
      message: 'Video deleted'
    });
  }
}
module.exports = new VideosController();