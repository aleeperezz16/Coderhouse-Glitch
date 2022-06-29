const router = require("express").Router();
const Container = require("../src/Contenedor");

router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;