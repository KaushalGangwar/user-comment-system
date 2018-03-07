'use strict';
const express = require('express');
const router  = express.Router();
const comment = require('./comments');

router.post('/post_comment', comment.postComment);
router.post('/reply', comment.replyToComment);
router.get('/view_comments', comment.viewAllComments);
router.post('/delete', comment.deleteComment);
module.exports = router;
