const router = require("express").Router();
const ludoController = require('../controllers/ludoController')

router
    .route('/')
    .get(ludoController.root);

router
    .route('/ludo')
    .get(ludoController.room);

module.exports = router;
