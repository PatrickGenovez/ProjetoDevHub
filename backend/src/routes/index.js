const express = require("express");
const router = express.Router();

const authRoutes = require('./auth');
const bookRoutes = require('./books');

router.use('/auth', authRoutes);
router.use('/books', bookRoutes);


router.get("/", (req, res) => {
  res.send("API rodando!");
});

module.exports = router;
