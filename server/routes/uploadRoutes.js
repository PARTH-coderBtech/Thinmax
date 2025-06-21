const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");

router.post('/upload-image', auth, admin, upload.single('image'), (req, res) => {
  res.json({ imageUrl: req.file.path });
});

module.exports = router;
