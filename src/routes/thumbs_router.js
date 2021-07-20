const express = require('express');
const router = express.Router();
const ThumbsController = require('../controllers/thumbs_controller');
const multer = require('multer');
const multerConfig = require('../services/aws');
const reqFile = require('../middlewares/setReqFileTest');

router.get('/thumbs', ThumbsController.get_thumbs);
router.post('/thumb', [reqFile, multer(multerConfig).single('file')], ThumbsController.post_thumb);
router.delete('/thumb/:video_id', ThumbsController.delete_thumb);

module.exports = router;