const postService = require('./post.service');
const { formatPost } = require('./post.dto');
const { uploadToCloudinary } = require('../../utils/upload');
const { UPLOAD_FOLDERS } = require('../../utils/constants');

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/mov', 'video/avi'];

const createPost = async (req, res, next) => {
  try {
    let imageUrl = null;
    let videoUrl = null;

    if (req.file) {
      const mimeType = req.file.mimetype;
      const isVideo = VIDEO_TYPES.includes(mimeType);
      try {
        const result = await uploadToCloudinary(req.file.buffer, UPLOAD_FOLDERS.POST, {}, mimeType);
        if (isVideo) {
          videoUrl = result.secure_url;
        } else {
          imageUrl = result.secure_url;
        }
      } catch (uploadErr) {
        console.warn('[Post] Media upload skipped:', uploadErr.message);
      }
    }

    const post = await postService.createPost(req.user.id, req.body.content, imageUrl, videoUrl);
    res.status(201).json({ success: true, data: { post: formatPost(post, req.user.id) }, message: 'Post created' });
  } catch (err) {
    next(err);
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await postService.getPostById(req.params.id, req.user?.id);
    res.json({ success: true, data: { post: formatPost(post, req.user?.id) } });
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await postService.updatePost(req.params.id, req.user.id, req.body.content);
    res.json({ success: true, data: { post: formatPost(post, req.user.id) }, message: 'Post updated' });
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    await postService.deletePost(req.params.id, req.user.id);
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
};

const likePost = async (req, res, next) => {
  try {
    await postService.likePost(req.params.id, req.user.id);
    res.json({ success: true, message: 'Post liked' });
  } catch (err) {
    next(err);
  }
};

const unlikePost = async (req, res, next) => {
  try {
    await postService.unlikePost(req.params.id, req.user.id);
    res.json({ success: true, message: 'Post unliked' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createPost, getPost, updatePost, deletePost, likePost, unlikePost };