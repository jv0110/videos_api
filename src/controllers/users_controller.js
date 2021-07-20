const UsersModel = require('../models/users_model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UsersController{
  async get_users(req, res){
    const users = await UsersModel.get_users();
    if(!users.length){
      return res.status(404).json({
        message: 'Users not found'
      });
    }
    return res.status(200).send(users);
  }

  async get_user(req, res){
    const { user_id } = req.params;
    let user = '';
    if(isNaN(user_id)){
      return res.status(400).json({
        message: 'Invalid user id'
      });
    }
    user = await UsersModel.get_user(user_id);
    if(!user.length){
      return res.status(404).json({
        message: 'User not found'
      });
    }
    return res.status(200).send(user);
  }

  async post_user(req, res){
    const data = {
      ...req.body
    }
    let user_exists = '';
    let post_user = '';

    if(!data.user_name){
      return res.status(400).json({
        message: 'User name not sent'
      });
    }else if(!data.user_email){
      return res.status(400).json({
        message: 'User email not sent'
      });
    }else if(!data.user_password){
      return res.status(400).json({
        message: 'User password not sent'
      });
    }
    user_exists = await UsersModel.get_user_by_email(data.user_email);
    if(user_exists.length){
      return res.status(403).json({
        message: 'User already exists'
      });
    }
    post_user = await UsersModel.post_user(data);
    if(!post_user){
      return res.status(500).json({
        message: 'Error posting user'
      });
    }
    return res.status(201).send(post_user);
  }

  async login (req, res){
    const data = {
      ...req.body
    }
    let user = '';

    if(!data.user_email){
      return res.status(400).json({
        message: 'Email not sent'
      });
    }else if(!data.user_password){
      return res.status(400).json({
        message: 'Password not sent'
      });
    }

    user = await UsersModel.get_user_by_email(data.user_email);
    if(!user.length){
      return res.status(404).json({
        message: 'User not found'
      });
    }
    if(!bcrypt.compareSync(data.user_password, user[0].user_password)){
      return res.status(403).json({
        message: 'Wrong password'
      });
    }
    jwt.sign({ user_id: user[0].user_id }, process.env.JWT_SECRET, (err, token) => {
      if(err){
        console.log(err);
        return res.status(500).json({
          message: 'Error singning in access token'
        });
      }else{
        return res.status(200).json({
          token: token
        });
      }
    });
  }
}
module.exports = new UsersController();