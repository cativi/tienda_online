const router = require('express').Router();
const bcrypt = require('bcryptjs');

// My owned Imports

const User = require('./../../models/user.model');
const Product = require('./../../models/product.model');

const { validate, checkToken } = require('../../helpers/middlewares');
const registerSchema = require('./../../schemas/register.schema');
const { createToken } = require('./../../helpers/utils');

// Routes

router.get('/profile', checkToken, (req, res) => {
    // al pasar por checkToken YA tenemos los datos del usuario 


    // Aquí ya solo necesitamos mostrar en la respuesta via res.json
    res.json(req.user);

});

router.get('/products', checkToken, async (req, res) => {
    // con checktoken, tengo los datos de req.user
    //En MySQL sería: SELECT * FROM products WHERE creator = ?
    const products = await Product.find({ creator: req.user._id });
    res.json(products);
});

router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('cart');
        res.json(user);
    } catch (error) {
        res.json(error);
    }
});

router.post('/register', validate(registerSchema), async (req, res) => {

    // Body: name, email, password
    req.body.password = bcrypt.hashSync(req.body.password, 12);

    try {

        const newUser = await User.create(req.body);
        res.json(newUser);
    } catch (error) {
        res.json(error.errors);
    }

});

router.post('/login', async (req, res) => {
    // Body: email, password
    const { email, password } = req.body;

    // ¿Existe el Email en BBDD?

    const user = await User.findOne({ email });
    // const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(403).json({ fatal: 'Datos incorrectos, vuelve a probar' });
    }



    // Comprobar si las passwords coinciden
    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
        return res.status(403).json({ fatal: 'Datos incorrectos, vuelve a probar' });
    }

    res.json({
        message: 'Login correcto',
        token: createToken(user)
    });


});



module.exports = router;