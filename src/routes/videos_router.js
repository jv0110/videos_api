const express = require('express');
const router = express.Router();
const VideosController = require('../controllers/videos_controller');

router.get('/videos', VideosController.get_videos);
router.post('/video', VideosController.post_video);
router.put('/video', VideosController.update_video);
router.delete('/video/:video_id', VideosController.delete_video);

module.exports = router;