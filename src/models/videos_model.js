const db = require('../databse/db');

class VideosModel{
  async select_videos(){
    try{
      return await db
      .select('video_id', 'title', 'description', 'duration', 'likes', 'deslikes')
      .from('video');
    }catch(err){
      console.log(err);
    }
  }
  async select_videos_with_thumbs(){
    try{
      return await db
      .select('video.video_id', 'title', 'description', 'duration', 'likes', 'deslikes', 'thumbs.video_id', 'thumbs.thumb_url')
      .from('video')
      .innerJoin('thumbs', 'video.video_id', 'thumbs.video_id');
    }catch(err){
      console.log(err);
    }
  }
  async select_video(video_id){
    try{
      return await db
      .select('video_id', 'title', 'description', 'duration', 'likes', 'deslikes')
      .from('video')
      .where({ video_id });
    }catch(err){
      console.log(err);
    }
  }
  async insert_video(data){
    try{
      return await db
      .insert(data)
      .into('video');
    }catch(err){
      console.log(err);
    }
  }
  async update_video(data, video_id){
    try{
      return await db
      .table('video')
      .where({ video_id })
      .update(data);
    }catch(err){
      console.log(err);
    }
  }
  async delete_video(video_id){
    try{
      return await db
      .table('video')
      .where({ video_id })
      .del();
    }catch(err){
      console.log(err);
    }
  }
  async delete_videos(){
    try{
      return await db
      .table('video')
      .where('video_id', '>', 0)
      .del();
    }catch(err){
      console.log(err);
    }
  }
}
module.exports = new VideosModel();