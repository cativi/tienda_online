const router = require('express').Router();

const { checkToken } = require('../helpers/middlewares');

// El CheckToken solo se aplica en products, no en users (req.user tras haber atravesado checktoken)
router.use('/products', checkToken, require('./api/products'));
router.use('/users', require('./api/users'));


module.exports = router;