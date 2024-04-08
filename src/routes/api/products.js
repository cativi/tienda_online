const router = require('express').Router();

const Product = require('../../models/product.model');
const User = require('./../../models/user.model');
const { validate, checkProductId } = require('../../helpers/middlewares');
const productSchema = require('./../../schemas/product.schema');


// No olvidar los try catch en todos los router...


router.get('/', async (req, res) => {

    try {
        const products = await Product.find()
        // esto es lo mismo que SELECT * FROM products en MySQL queries
        res.json(products);
    } catch (error) {
        res.json({ fatal: error.message });
    }

});



router.get('/price/:minPrice/max/:maxPrice', async (req, res) => {
    const { minPrice, maxPrice } = req.params;

    try {
        const products = await Product.find({
            price: { $gt: minPrice, $lt: maxPrice }
        });
        res.json(products);
    } catch (error) {
        res.json({ fatal: error.message });
    }

});

router.get('/activos', async (req, res) => {

    try {
        const products = await Product.find({
            available: true,
            stock: { $gte: 100 }
        });
        res.json(products);
    } catch (error) {
        res.status({ fatal: 'Error al recuperar los productos activos' });
    }
});

router.get('/:department', async (req, res) => {

    const { department } = req.params;

    try {
        const products = await Product.find({ department: department });
        // esto es lo mismo que SELECT * FROM products WHERE departamento = ? en MySQL queries
        res.json(products);
    } catch (error) {
        res.json({ fatal: error.message });
    }

});


router.post('/', validate(productSchema), async (req, res) => {
    // req.body: name, description, price, department, available, stock
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
});

router.put('/add_cart', checkProductId, async (req, res) => {

    // Comprobar el ID del articulo y actualizo su propiedad cart


    // Opción 1: Recuperar el usuario por ID y actualizar su propiedad cart
    // const user = await User.findByIdAndUpdate(req.user._id, {
    //     $push: { cart: req.body.product_id }
    // }, { new: true }).populate('cart');

    // res.json(user);

    // Opción 2: Sobre el usuario obtenido en el middleware, modifico su propiedad cart y la guardo.

    req.user.cart.push(req.body.product_id)
    await req.user.save();

    res.json(req.user);



});

router.put('/:productId', async (req, res) => {
    const { productId } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate
        (productId, req.body, { new: true }
        );
    res.json(updatedProduct);
});

router.delete('/:productId', async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findByIdAndDelete
        (productId);
    res.json(product);
});

module.exports = router;