const ThumbsModel = require('../models/thumbs_model');
const VideosModel = require('../models/videos_model');

class ThumbsController{
  async get_thumbs(req, res){
    const thumbs = await ThumbsModel.get_thumbs();
    if(!thumbs.length){
      return res.status(404).json({
        message: 'No thumbs found'
      });
    }
    return res.status(200).send(thumbs);
  }
  async post_thumb(req, res){
    const data = {
      video_id: req.body.video_id,
      file: {
        ...req.file 
      }
    }
    if(!data.video_id){
      return res.status(400).json({
        message: 'Video id is needed'
      })
    }else{
      const find_video = await VideosModel.select_video(data.video_id);
      if(!find_video.length){
        return res.status(404).json({
          message: 'Thumbs video not found'
        });
      }
      // as it is not allowed to have more than one thumb with the same video_id, checking is needed
      const video_thumb_exists = await ThumbsModel.get_thumb_by_video_id(data.video_id);
      if(video_thumb_exists.length){
        return res.status(403).json({
          message: 'Video thumb already exists'
        });
      }
    }
    if(!Object.keys(data.file).length){
      return res.status(200).json({
        message: 'Nothing to upload'
      });
    }else{
      if(!data.file.key){
        return res.status(400).json({
          message: 'No file key passed'
        });
      }else if(!data.file.location){
        return res.status(400).json({
          message: 'No file ulr passed'
        });
      }else if(!data.file.size){
        return res.status(400).json({
          message: 'No file size passed'
        });
      }
    }
    if(!await ThumbsModel.post_thumb({
      video_id: data.video_id,
      thumb_title: data.file.key,
      thumb_size: data.file.size,
      thumb_url: data.file.location
    })){
      return res.status(500).json({
        message: 'Error uploading thumb'
      });
    }
    return res.status(201).json({
      message: 'Thumb posted'
    });
  }
  async delete_thumb(req, res){
    const { video_id } = req.params;
    if(isNaN(video_id)){
      return res.status(400).json({
        message: 'Invalid video id'
      });
    }else{
      const video_found = await ThumbsModel.get_thumb_by_video_id(video_id);
      if(!video_found.length){
        return res.status(404).json({
          message: 'Could not find the video which thumb belongs to'
        });
      }
    }
    const del_thumb = await ThumbsModel.delete_thumb_by_id(video_id);
    if(!del_thumb){
      return res.status(500).json({
        message: 'Error deleting thumb, an error has ocurred'
      });
    }
    return res.status(200).json({
      message: 'Thumb deleted'
    });
  }
}
module.exports = new ThumbsController();