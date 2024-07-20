const router = require("express").Router();
const ludoController = require('../controllers/ludoController')

router
    .route('/')
    .get(ludoController.root);

router
    .route('/:ROOMCODE')
    .get(ludoController.room);

router.get('/spectate/:ROOMCODE', ludoController.spectateRoom);

    

module.exports = router;
