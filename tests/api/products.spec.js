const request = require('supertest');
const mongoose = require('mongoose');

const app = require('./../../src/app');
const Product = require('./../../src/models/product.model');

describe('Todas las pruebas de Api de Productos: GET, POST, PUT, DELETE', () => {

    beforeAll(async () => {
        // Conexión a la Base de datos
        await mongoose.connect('mongodb://127.0.0.1:27017/tienda_online');

    });

    afterAll(async () => {
        await mongoose.disconnect();
    })

    // describe GET
    describe('Pruebas GET /api/productos', () => {

        let response;

        beforeAll(async () => {
            response = await request(app).get('/api/products').send();
        });


        it('url /api/products existe', () => {
            expect(response.statusCode).toBe(200);
        });

        it('La respuesta debe ser formato JSON', () => {
            expect(response.headers['content-type']).toContain('application/json');
        });

        it('la respuesta debe ser un array', () => {
            expect(response.body).toBeInstanceOf(Array);
        })
    });

    // describe POST
    describe('Pruebas POST /api/products', () => {

        const body = {
            name: 'Nombre de Prueba',
            description: 'Descripción de Prueba',
            price: 1222,
            department: 'Departamento de Prueba',
            available: true,
            stock: 3999
        }

        let response;
        beforeAll(async () => {
            response = await request(app).post('/api/products').send(body);
        });

        afterAll(async () => {
            // SQL Query - DELETE FROM products WHERE department = test; en MongoDB.
            response = await Product.deleteMany({ department: 'test' });
        });

        it('Debería funcionar la URL', () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toContain('application/json');
        });

        it('El ID debería estar incluido en el Body de la Respuesta', () => {
            expect(response.body._id).toBeDefined();
        });



    });

    // describe PUT
    describe('Pruebas PUT /api/products', () => {

        const body = {
            name: 'Prueba editando',
            description: 'Descripción de Editando Prueba',
            price: 122,
            department: 'Departamento de Prueba Edit',
            available: true,
            stock: 3945
        }

        let response;
        let newProduct;

        beforeAll(async () => {
            // En la BD creamos el producto a modificar
            newProduct = await Product.create(body);
            // Lanzamos la petición de PUT
            response = await request(app)
                .put(`/api/products/${newProduct._id}`)
                .send({
                    price: 300,
                    department: 'otro departamento'
                });
        });

        // Borrar el objeto tras terminar las pruebas
        afterAll(async () => {
            await Product.findByIdAndDelete(newProduct._id);
        });

        it('Debería funcionar la URL', () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toContain('application/json');
        });

        it('Mirar que el precio sean 300 y el departamento sea otro', () => {
            expect(response.body.price).toBe(300);
            expect(response.body.department).toBe('otro departamento');
        });

    });

    // describe DELETE
    describe('Pruebas DELETE /api/products', () => {

        const body = {
            name: 'Prueba de Borrar - name',
            description: 'Prueba de borrar - descripción',
            price: 122,
            department: 'Departamento de Prueba - borrar',
            available: true,
            stock: 3945
        }

        let response;
        let newProduct;

        beforeAll(async () => {
            // Crear el producto a borrar
            newProduct = await Product.create(body);
            // Lanzo la petición
            response = await request(app).delete(`/api/products/${newProduct._id}`).send();
        });

        it('Debería funcionar la URL', () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toContain('application/json');
        });

        it('Debería desaparecer el producto de la base de datos', async () => {
            const product = await Product.findById(newProduct._id);
            expect(product).toBeNull();
        });


    });
});



