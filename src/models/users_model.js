const db = require('../databse/db');
const bcrypt = require('bcryptjs');

class UsersModel{
  async get_users(){
    try{
      return await db
      .select('user_id', 'user_name', 'user_email')
      .from('users')
    }catch(err){
      console.log(err);
    }
  }
  async get_user(user_id){
    try{
      return await db
      .select('user_id', 'user_name', 'user_email')
      .from('users')
      .where({ user_id })
    }catch(err){
      console.log(err);
    }
  }
  async get_user_w_password(user_id){
    try{
      return await db
      .select('user_id', 'user_name', 'user_email', 'user_password')
      .from('users')
      .where({ user_id });
    }catch(err){
      console.log(err);
    }
  }
  async get_user_by_email(user_email){
    try{
      return await db
      .select('user_id', 'user_name', 'user_email', 'user_password')
      .from('users')
      .where({ user_email })
    }catch(err){
      console.log(err);
    }
  }
  async post_user(data){
    const salt = bcrypt.genSaltSync(11);
    const hash = bcrypt.hashSync(data.user_password, salt);
    data.user_password = hash;

    try{
      return await db
      .insert(data)
      .into('users');
    }catch(err){
      console.log(err);
    }
  }
  async delete_users(){
    try{
      return await db
      .table('users')
      .where('user_id', '>', 0)
      .del()
    }catch(err){
      console.log(err);
    }
  }
}
module.exports = new UsersModel();