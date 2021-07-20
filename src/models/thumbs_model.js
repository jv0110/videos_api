const db = require('../databse/db');

class ThumbsModel{
  async get_thumbs(){
    try{
      return await db
      .select('video_id', 'thumb_id', 'thumb_title', 'thumb_size', 'thumb_url')
      .from('thumbs');
    }catch(err){
      console.log(err);
    }
  }
  async get_thumb(thumb_id){
    try{
      return await db
      .select('video_id', 'thumb_id', 'thumb_title', 'thumb_size', 'thumb_url')
      .from('thumbs')
      .where({ thumb_id });
    }catch(err){
      console.log(err);
    }
  }
  async get_thumb_by_video_id(video_id){
    try{
      return await db
      .select('video_id', 'thumb_id', 'thumb_title', 'thumb_size', 'thumb_url')
      .from('thumbs')
      .where({ video_id });
    }catch(err){
      console.log(err);
    }
  }
  async post_thumb(data){
    try{
      return await db
      .insert(data)
      .into('thumbs');
    }catch(err){
      console.log(err);
    }
  }
  async delete_thumb_by_id(video_id){
    try{
      return await db
      .table('thumbs')
      .where({ video_id })
      .del();
    }catch(err){
      console.log(err);
    }
  }
  async delete_thumbs(){
    try{
      return await db
      .table('thumbs')
      .where('thumb_id', '>', 0)
      .del();
    }catch(err){
      console.log(err);
    }
  }
}
module.exports = new ThumbsModel();