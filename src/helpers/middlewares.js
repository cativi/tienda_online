const jwt = require('jsonwebtoken');
const User = require('./../models/user.model')
const Product = require('./../models/product.model')

const validate = (validationSchema) => {
    // Ojo, el validationSchema usa Yup

    return async (req, res, next) => {
        try {
            await validationSchema.validate(req.body, { abortEarly: false });
            next();
        } catch (error) {
            console.log(error);
            res.json(error.errors);
        }

    }

}

const checkRole = (role) => {
    return (req, res, next) => {
        if (req.user.role === role) {
            return next();
        }
        res.json({ fatal: '¡No puedes pasar!' })
    }
}

const checkToken = async (req, res, next) => {

    if (!req.headers.authorization) {
        return res.status(401).json({ fatal: 'Debes incluir el token de autenticación' });
    }

    const token = req.headers.authorization;


    let obj;
    try {
        obj = jwt.verify(token, process.env.SECRET_KEY);
        console.log(obj);
    }
    catch (error) {
        return res.status(401).json({ fatal: 'El token es incorrecto' });
    }


    // Opción MySQL: const [usuarios] = await Usuario.selectById(obj._id);

    // Opción Mongoose - MongoDB
    const user = await User.findById(obj.id);

    req.user = user;

    next();
};

const checkProductId = async (req, res, next) => {

    try {
        const product = await Product.findById(req.body.product_id);

        if (!product) {
            res.status(400).json({ fatal: 'El Id del producto no existe' })
        }
        next();
    } catch (error) {
        res.status(400).json({ fatal: 'El Id del producto no existe' })
    }
}

module.exports = { validate, checkRole, checkToken, checkProductId };